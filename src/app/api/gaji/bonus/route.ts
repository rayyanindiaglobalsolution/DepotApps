import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id, bonus } = await req.json();
  try {
    // Cari data rekap yang lama
    const rekapLama = await prisma.rekap_gaji.findUnique({ where: { id: parseInt(id) } });
    
    // Hitung total baru: total_akhir (pokok) + bonus
    const totalBaru = Number(rekapLama?.total_akhir || 0) + parseInt(bonus);

    // Update bonus dan total
    await prisma.rekap_gaji.update({
      where: { id: parseInt(id) },
      data: { 
        bonus: parseInt(bonus),
        total_akhir: totalBaru 
      }
    });
    return NextResponse.json({ message: "Bonus berhasil disimpan" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal" }, { status: 500 });
  }
}