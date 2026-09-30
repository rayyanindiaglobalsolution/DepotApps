import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { pegawai_id, periode_awal, periode_akhir, bonus } = await req.json();

    // 1. Ambil data absensi pegawai di periode tersebut
    const absensi = await prisma.absensi_pegawai.findMany({
      where: {
        pegawai_id: parseInt(pegawai_id),
        tanggal: { gte: new Date(periode_awal), lte: new Date(periode_akhir) }
      }
    });

    const totalHari = absensi.reduce((sum, item) => sum + (item.masuk_kerja || 0), 0);
    const totalSetengahHari = absensi.reduce((sum, item) => sum + (item.setengah_hari || 0), 0);
    
    // 2. Ambil gaji harian pegawai
    const pegawai = await prisma.pegawai.findUnique({ where: { id: parseInt(pegawai_id) } });
    const gajiHarian = pegawai?.gaji_harian || 0;
    
    // 3. Hitung total (Rumus: (Hari * Gaji) + (SetengahHari * Gaji/2) + Bonus)
    const totalGaji = (totalHari * gajiHarian) + (totalSetengahHari * (gajiHarian / 2)) + (bonus || 0);

    // 4. Simpan ke rekap_gaji
    await prisma.rekap_gaji.create({
      data: {
        pegawai_id: parseInt(pegawai_id),
        periode_awal: new Date(periode_awal),
        periode_akhir: new Date(periode_akhir),
        total_hari_masuk: totalHari,
        total_setengah_hari: totalSetengahHari,
        bonus: parseInt(bonus),
        total_akhir: Math.floor(totalGaji)
      }
    });

    return NextResponse.json({ message: "Gaji berhasil diproses" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memproses gaji" }, { status: 500 });
  }
}