import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { StatusTransaksi } from "@prisma/client"; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kurirId = searchParams.get('kurirId');

    // JIKA ADA kurirId, ambil order khusus kurir itu
    if (kurirId) {
      const kurirOrders = await prisma.transaksi.findMany({
        where: { kurir_id: kurirId },
        include: { details: true },
        orderBy: { tanggal: 'desc' }
      });
      return NextResponse.json(kurirOrders);
    }

    // JIKA TIDAK ADA kurirId, jalankan fungsi default (semua order)
    const orders = await prisma.transaksi.findMany({
  where: {
    status: { 
      in: [
        StatusTransaksi.PENDING_ASSIGN, 
        StatusTransaksi.ON_DELIVERY,
        StatusTransaksi.WAITING_FOR_RETURN // <--- TAMBAHKAN INI
      ] 
    }
  },
  include: { details: true },
  orderBy: { tanggal: 'desc' }
});

    const formattedOrders = orders.map(order => ({
      ...order,
      tanggal: order.tanggal?.toISOString(),
      details: order.details || [] 
    }));

    return NextResponse.json(formattedOrders);
    
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Gagal mengambil data" }, { status: 500 });
  }
}