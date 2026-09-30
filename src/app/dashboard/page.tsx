"use client";
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); });
  }, []);

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-400">Memuat Data...</div>;

  return (
    <div className="p-10 bg-[#FFFFFF] min-h-screen text-slate-900 font-sans">
      
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Operasional</h1>
        <p className="text-slate-500 text-sm mt-1">Ringkasan performa manajemen depot air minum (Data 1 Bulan Terakhir)</p>
      </div>

      {/* Kartu Indikator */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <EmbossedCard title="TOTAL PENDAPATAN" value={`Rp ${stats.transaksi.total_omset_minggu_lalu.toLocaleString()}`} />
        <EmbossedCard title="VOLUME GALON KELUAR" value={stats.transaksi.total_galon_keluar_minggu_lalu} />
        <EmbossedCard title="PELANGGAN AKTIF" value={stats.pelanggan.aktif} />
        <EmbossedCard title="RATA-RATA TRANS/HARI" value={stats.transaksi.rata_rata_minggu_ini.toFixed(1)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Panel Stok */}
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]">
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-8">Inventaris Stok</h3>
          <div className="space-y-8">
            <StockItem label="Aqua" value={stats.stok_di_pelanggan.saldo_aqua} />
            <StockItem label="Keran" value={stats.stok_di_pelanggan.saldo_keran} />
            <StockItem label="Dispenser" value={stats.stok_di_pelanggan.saldo_dispenser} />
          </div>
        </div>

        {/* Tabel Data - Sesuai Permintaan */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <SimpleTable title="10 Transaksi Terbesar" data={stats.pelanggan.top10_terbesar} isCurrency />
          <SimpleTable title="10 Pelanggan Paling Aktif" data={stats.pelanggan.top10_aktif} />
        </div>
      </div>
    </div>
  );
}

// --- Komponen ---

function EmbossedCard({ title, value }: any) {
  return (
    <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.5)]">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function StockItem({ label, value }: any) {
  return (
    <div className="flex justify-between items-end">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="text-2xl font-bold text-slate-900">{value}</span>
    </div>
  );
}

function SimpleTable({ title, data, isCurrency }: any) {
  return (
    <div className="bg-slate-50 border border-slate-200 p-6 rounded-xl shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.5)]">
      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">{title}</h3>
      <div className="space-y-4">
        {data.map((item: any, i: number) => (
          <div key={i} className="flex justify-between items-center text-sm border-b border-slate-200 pb-3 last:border-0">
            <span className="text-slate-600">{item.nama}</span>
            <span className="font-bold text-slate-900">{isCurrency ? `Rp ${item.total.toLocaleString()}` : item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}