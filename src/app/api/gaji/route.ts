import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const dataGaji = await prisma.rekap_gaji.findMany({
      include: { pegawai: true }
    });

    // Mengonversi BigInt menjadi Number agar bisa diserialisasi ke JSON
    const serializedGaji = JSON.parse(
      JSON.stringify(dataGaji, (key, value) =>
        typeof value === 'bigint' ? value.toString() : value
      )
    );

    return NextResponse.json(serializedGaji);
  } catch (error) {
    console.error("Error fetching data gaji:", error);
    return NextResponse.json({ error: 'Gagal mengambil data gaji' }, { status: 500 });
  }
}