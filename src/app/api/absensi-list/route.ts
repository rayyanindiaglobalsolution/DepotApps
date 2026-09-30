import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.absensi_pegawai.findMany({
      include: { 
        pegawai: true // Agar kita bisa menampilkan nama pegawai di tabel
      },
      orderBy: { 
        tanggal: 'desc' // Menampilkan data terbaru paling atas
      }
    });
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching absensi:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}