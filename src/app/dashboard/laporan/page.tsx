import prisma from "@/lib/prisma";
import LaporanView from "./LaporanView";
import { tambahPengeluaran } from "./actions";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ dari?: string, sampai?: string }> }) {
  const params = await searchParams;

  const today = new Date();
  const getSaturday = (d: Date) => { const t = new Date(d); t.setDate(t.getDate() - (t.getDay() + 1) % 7 - 1); return t; };
  const dari = params.dari || getSaturday(today).toISOString().split("T")[0];
  const sampai = params.sampai || today.toISOString().split("T")[0];

  const transaksi = await prisma.transaksi.findMany({
    where: { tanggal: { gte: new Date(dari), lte: new Date(sampai) }, status_verifikasi: 'disetujui' },
    include: { details: true }, 
    orderBy: { tanggal: 'asc' }
  });

  const pengeluaran = await prisma.pengeluaran.findMany({
    where: { tanggal: { gte: new Date(dari), lte: new Date(sampai) } }, 
    orderBy: { tanggal: 'asc' }
  });

  // Konversi semua data ke plain object agar tidak error Decimal
  const formattedTransaksi = transaksi.map(t => ({
    ...t,
    total_harga: Number(t.total_harga),
    details: t.details.map(d => ({
      ...d,
      qty_keluar: Number(d.qty_keluar),
      bonus: Number(d.bonus)
    }))
  }));

  const formattedPengeluaran = pengeluaran.map(p => ({
    ...p,
    nominal: Number(p.nominal)
  }));

  const totalPendapatan = formattedTransaksi.reduce((acc, t) => acc + t.total_harga, 0);
  const totalGalon = formattedTransaksi.reduce((acc, t) => acc + t.details.reduce((sum, d) => sum + (d.qty_keluar + d.bonus), 0), 0);
  const totalPengeluaran = formattedPengeluaran.reduce((acc, p) => acc + p.nominal, 0);
  
  const dailyReport = formattedTransaksi.reduce((acc, t) => {
    const dateKey = t.tanggal.toISOString().split('T')[0];
    if (!acc[dateKey]) acc[dateKey] = { pendapatan: 0, galon: 0 };
    acc[dateKey].pendapatan += t.total_harga;
    acc[dateKey].galon += t.details.reduce((sum, d) => sum + (d.qty_keluar + d.bonus), 0);
    return acc;
  }, {} as Record<string, { pendapatan: number, galon: number }>);

  return (
    <LaporanView 
      data={{ 
        transaksi: formattedTransaksi, 
        pengeluaran: formattedPengeluaran, 
        totalPendapatan, 
        totalGalon, 
        totalPengeluaran, 
        dailyReport, 
        dari, 
        sampai 
      }}
      tambahPengeluaran={tambahPengeluaran} 
    />
  );
}