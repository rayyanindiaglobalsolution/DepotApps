import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const now = new Date();
  const oneMonthAgo = new Date(new Date().setDate(now.getDate() - 30));
  const oneWeekAgo = new Date(new Date().setDate(now.getDate() - 7));
  const twoWeeksAgo = new Date(new Date().setDate(now.getDate() - 14));

  // 1. Stok di pelanggan
  const totalStok = await prisma.pelanggan.aggregate({
    _sum: { saldo_aqua: true, saldo_keran: true, saldo_dispenser: true }
  });

  const sumAqua = totalStok._sum.saldo_aqua || 0;
  const sumKeran = totalStok._sum.saldo_keran || 0;
  const sumDispenser = totalStok._sum.saldo_dispenser || 0;
  const totalKeseluruhanGalon = sumAqua + sumKeran + sumDispenser;

  // 1.5 Ambil Stok Depot dari database dan kurangi dengan galon di pelanggan
  const stokDepotData = await prisma.stokDepot.findMany();
  
  let fisikAqua = 0;
  let fisikKeran = 0;
  let fisikDispenser = 0;

  stokDepotData.forEach((item) => {
    const jenis = item.jenis_galon ? item.jenis_galon.toLowerCase() : "";
    if (jenis === 'aqua') fisikAqua = item.jumlah;
    if (jenis === 'keran') fisikKeran = item.jumlah;
    if (jenis === 'dispenser') fisikDispenser = item.jumlah;
  });

  // Rumus Baru: Jumlah di depot dikurangi jumlah total di pelanggan
  const stok_depot = {
    Aqua: fisikAqua - sumAqua,
    Keran: fisikKeran - sumKeran,
    Dispenser: fisikDispenser - sumDispenser
  };

  // 2. Transaksi (Minggu Ini & Minggu Lalu)
  const transaksiMingguIni = await prisma.transaksi.findMany({ 
    where: { tanggal: { gte: oneWeekAgo } }, include: { details: true } 
  });
  
  const transaksiMingguLalu = await prisma.transaksi.findMany({ 
    where: { tanggal: { gte: twoWeeksAgo, lt: oneWeekAgo } }, include: { details: true } 
  });

  // 3. Pelanggan Data
  const allPelanggan = await prisma.pelanggan.findMany({ include: { transaksi: true } });
  
  // Hitung data pelanggan
  const pelangganAktif = allPelanggan.filter(p => p.transaksi.some(t => t.tanggal >= oneMonthAgo));
  const pelangganTidakAktif = allPelanggan.filter(p => !p.transaksi.some(t => t.tanggal >= oneMonthAgo));

  // Top 10
  const top10Aktif = allPelanggan
    .map(p => ({ nama: p.nama, count: p.transaksi.filter(t => t.tanggal >= oneMonthAgo).length }))
    .sort((a, b) => b.count - a.count).slice(0, 10);

  const top10Terbesar = allPelanggan
    .map(p => ({ nama: p.nama, total: p.transaksi.reduce((sum, t) => sum + (t.total_harga || 0), 0) }))
    .sort((a, b) => b.total - a.total).slice(0, 10);

  return NextResponse.json({
    stok_di_pelanggan: {
      saldo_aqua: sumAqua,
      saldo_keran: sumKeran,
      saldo_dispenser: sumDispenser,
      total_keseluruhan: totalKeseluruhanGalon
    },
    stok_depot: stok_depot, // <-- Data stok depot ditambahkan di sini
    transaksi: {
      rata_rata_minggu_ini: transaksiMingguIni.length / 7,
      rata_rata_galon_keluar_minggu_ini: transaksiMingguIni.reduce((sum, t) => sum + t.details.reduce((s, d) => s + (d.qty_keluar || 0), 0), 0) / 7,
      total_galon_keluar_minggu_lalu: transaksiMingguLalu.reduce((sum, t) => sum + t.details.reduce((s, d) => s + (d.qty_keluar || 0), 0), 0),
      total_omset_minggu_lalu: transaksiMingguLalu.reduce((sum, t) => sum + (t.total_harga || 0), 0)
    },
    pelanggan: {
      total: allPelanggan.length,
      aktif: pelangganAktif.length,
      tidak_aktif: pelangganTidakAktif.length,
      top10_aktif: top10Aktif,
      top10_terbesar: top10Terbesar
    }
  });
}