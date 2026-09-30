import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const data = await prisma.rekap_gaji.findUnique({
      where: { id: parseInt(id) },
      include: { pegawai: true },
    });

    if (!data) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    }

    // KONVERSI BIGINT KE NUMBER AGAR BISA DI-JSON
    const serializedData = {
      ...data,
      total_gaji: data.total_gaji ? Number(data.total_gaji) : 0,
      // Jika ada field BigInt lain, konversikan juga di sini
    };

    return NextResponse.json(serializedData);
  } catch (error) {
    console.error("DETAIL ERROR PRISMA:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}