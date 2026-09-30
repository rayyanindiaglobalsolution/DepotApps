import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { nama_pelanggan, details, total_harga } = await req.json();

    const newTransaksi = await prisma.transaksi.create({
      data: {
        nama_pelanggan: nama_pelanggan, 
        total_harga: parseInt(total_harga) || 0,
        
        // --- PERUBAHAN DI SINI ---
        // Karena kita sudah pakai Enum StatusTransaksi,
        // kita masukkan status default-nya (PENDING_ASSIGN)
        status: "PENDING_ASSIGN", 
        
        tanggal: new Date(),
        details: {
          create: Object.entries(details).map(([produk, data]: [string, any]) => ({
            produk: produk,
            qty_keluar: parseInt(data.keluar) || 0,
            qty_kembali: parseInt(data.kembali) || 0,
            // Perhatikan: Jika data bonus dan kembali ada di detail, 
            // pastikan skema detail_transaksi Anda juga sudah punya kolom tersebut.
          }))
        }
      }
    });

    return NextResponse.json({ success: true, data: newTransaksi });
  } catch (error) {
    console.error("Error saat menyimpan transaksi:", error);
    return NextResponse.json({ error: "Gagal menyimpan transaksi" }, { status: 500 });
  }
}