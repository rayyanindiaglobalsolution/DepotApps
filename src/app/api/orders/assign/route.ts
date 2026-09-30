import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Menggunakan deklarasi global agar Prisma Client tidak dibuat berulang kali saat pengembangan (hot-reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request: Request) {
  try {
    const { transaksiId, kurirId } = await request.json();

    // Pastikan data yang diterima lengkap
    if (!transaksiId || !kurirId) {
      return NextResponse.json({ success: false, message: 'Data tidak lengkap' }, { status: 400 });
    }

    // Melakukan update
    const updateTransaksi = await prisma.transaksi.update({
      where: { id: transaksiId },
      data: { 
        kurir_id: kurirId,
        status: 'ON_DELIVERY' 
      },
    });

    return NextResponse.json({ success: true, data: updateTransaksi });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return NextResponse.json({ success: false, message: 'Gagal assign kurir' }, { status: 500 });
  }
}