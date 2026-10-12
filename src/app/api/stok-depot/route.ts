import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Mengambil data stok depot
export async function GET() {
  try {
    const stok = await prisma.stokDepot.findMany();
    return NextResponse.json(stok);
  } catch (error) {
    console.error("Gagal mengambil stok depot:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Menyimpan atau memperbarui stok depot
export async function POST(req: Request) {
  try {
    const { jenis_galon, jumlah } = await req.json();
    const qty = parseInt(jumlah) || 0;

    const updated = await prisma.stokDepot.upsert({
      where: { jenis_galon },
      update: { jumlah: qty },
      create: { jenis_galon, jumlah: qty },
    });

    return NextResponse.json({ message: "Stok depot berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("Gagal menyimpan stok depot:", error);
    return NextResponse.json({ error: "Gagal menyimpan stok depot" }, { status: 500 });
  }
}