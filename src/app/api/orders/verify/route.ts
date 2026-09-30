import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { transaksiId, status, details } = await req.json();

    // 1. Update status transaksi menjadi PENDING_VERIFIKASI
    await prisma.transaksi.update({
      where: { id: transaksiId },
      data: { status: status }, // status yang dikirim adalah "PENDING_VERIFIKASI"
    });

    // 2. Simpan detail verifikasi (opsional: simpan ke tabel log atau update field di detail_transaksi)
    // Di sini Anda bisa menambahkan logika untuk mencatat data 'kembali' dan 'bonus'
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error verifikasi:", error);
    return NextResponse.json({ error: "Gagal memproses verifikasi" }, { status: 500 });
  }
}