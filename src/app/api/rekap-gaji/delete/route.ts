import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { id } = await req.json();

    // Hapus rekap berdasarkan ID
    await prisma.rekap_gaji.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ message: "Rekap berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus rekap" }, { status: 500 });
  }
}