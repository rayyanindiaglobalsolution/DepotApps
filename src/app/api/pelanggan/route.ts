import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Mengambil semua nama pelanggan dari model 'pelanggan'
    const data = await prisma.pelanggan.findMany({
      select: {
        nama: true // Hanya ambil kolom nama
      }
    });
    
    // Mengubah format menjadi List<String> agar sesuai dengan Android Anda
    const listNama = data.map(item => item.nama);
    
    return NextResponse.json(listNama);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}