import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const kurirList = await prisma.user.findMany({
      where: {
        // Mengambil semua user yang role-nya mengandung kata 'Kurir'
        role: {
          contains: 'Kurir' // Akan cocok dengan "Kurir" dan "Kepala Kurir"
        }
      },
      select: {
        id: true,
        name: true
      }
    });
    return NextResponse.json(kurirList);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data kurir" }, { status: 500 });
  }
}