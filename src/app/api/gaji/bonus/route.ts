import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id, bonus } = await req.json();
  try {
    const rekapId = parseInt(id);
    const nominalBonusBaru = parseInt(bonus) || 0;

    // 1. Ambil data rekap gaji lama
    const rekapLama = await prisma.rekap_gaji.findUnique({ 
      where: { id: rekapId },
      include: { pegawai: true } // Agar kita bisa tahu gaji harian & absensinya jika butuh
    });

    if (!rekapLama) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    // 2. Hitung ulang Gaji Pokok Murni dari absensi (supaya 100% akurat dan tidak melipat ganda)
    const gajiHarian = Number(rekapLama.pegawai?.gaji_harian || 0);
    const totalHari = Number(rekapLama.total_hari_masuk || 0);
    const totalSetengah = Number(rekapLama.total_setengah_hari || 0);

    const gajiPokokMurni = (totalHari * gajiHarian) + (totalSetengah * (gajiHarian / 2));

    // 3. Total akhir yang baru = Gaji Pokok Murni + Bonus Baru
    const totalBaru = gajiPokokMurni + nominalBonusBaru;

    // 4. Update database
    await prisma.rekap_gaji.update({
      where: { id: rekapId },
      data: { 
        bonus: nominalBonusBaru,
        total_akhir: totalBaru 
      }
    });

    return NextResponse.json({ message: "Bonus berhasil disimpan" });
  } catch (error) {
    console.error("Gagal save bonus:", error);
    return NextResponse.json({ error: "Gagal menyimpan bonus" }, { status: 500 });
  }
}