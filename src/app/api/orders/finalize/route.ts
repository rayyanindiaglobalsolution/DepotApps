import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { transaksiId, bonus, galon_kembali } = await req.json();

    // Pastikan transaksiId ada
    if (!transaksiId) {
      return NextResponse.json({ error: "ID Transaksi diperlukan" }, { status: 400 });
    }

    // Melakukan update data hasil verifikasi dan mengubah status ke COMPLETED
    const updatedOrder = await prisma.transaksi.update({
      where: { id: transaksiId },
      data: { 
        bonus: bonus,            // Input dari Kepala Kurir
        galon_kembali: galon_kembali, // Input dari Kepala Kurir
        status: "COMPLETED"      // Mengunci transaksi
      }
    });

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error) {
    console.error("Error finalizing order:", error);
    return NextResponse.json({ error: "Gagal memfinalisasi transaksi" }, { status: 500 });
  }
}