import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kurirId = searchParams.get('kurirId');

  const tasks = await prisma.transaksi.findMany({
    where: { 
      kurir_id: kurirId,
      // TAMBAHKAN FILTER INI:
      // Hanya ambil data yang statusnya ON_DELIVERY
      status: {
        in: ["ON_DELIVERY"] 
      }
    },
    include: { 
      pelanggan: true,
      details: true 
    }
  });

  return NextResponse.json(tasks);
}