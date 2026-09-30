import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const today = new Date();
    // Set awal hari ini (00:00:00)
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    
    // Set awal minggu ini (hari Minggu/Senin tergantung sistem Anda, ini contoh standar)
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));

    // 1. Ambil data target terbaru dari TargetDepot
    const target = await prisma.targetDepot.findFirst({
      orderBy: { updatedAt: 'desc' }
    });

    // 2. Ambil semua transaksi yang berkaitan dengan detailnya
    const transactions = await prisma.transaksi.findMany({
      where: {
        tanggal: { gte: startOfWeek } // Ambil data dari awal minggu agar efisien
      },
      include: {
        details: true // Mengambil data dari detail_transaksi
      }
    });

    // 3. Kalkulasi
    // Filter transaksi hari ini
    const transHariIni = transactions.filter(t => new Date(t.tanggal) >= startOfToday);
    
    const galonHariIni = transHariIni.reduce((sum, t) => 
      sum + t.details.reduce((sub, d) => sub + (d.qty_keluar || 0), 0), 0);
    
    const omsetHariIni = transHariIni.reduce((sum, t) => sum + (t.total_harga || 0), 0);

    // Filter transaksi minggu ini
    const galonMingguIni = transactions.reduce((sum, t) => 
      sum + t.details.reduce((sub, d) => sub + (d.qty_keluar || 0), 0), 0);
    
    const omsetMingguIni = transactions.reduce((sum, t) => sum + (t.total_harga || 0), 0);

    // 4. Kirim Respon ke Android
    return NextResponse.json({
      target_mingguan01: target?.target_mingguan01 || 0,
      target_mingguan02: target?.target_mingguan02 || 0,
      total_galon_hari_ini: galonHariIni,
      total_omset_hari_ini: omsetHariIni,
      total_galon_minggu_ini: galonMingguIni,
      total_omset_minggu_ini: omsetMingguIni
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json({ error: 'Gagal ambil data summary' }, { status: 500 });
  }
}