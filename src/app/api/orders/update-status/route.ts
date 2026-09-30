import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { transaksiId, status } = await req.json();

    // Validasi sederhana
    const updatedOrder = await prisma.transaksi.update({
      where: { id: transaksiId },
      data: { status: status as any }, // 'as any' membantu Prisma menerima string dari request
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error update status:", error);
    return NextResponse.json({ error: "Gagal update" }, { status: 500 });
  }
}