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

  // Variabel Sisa Galon di Depot
  const stokDepotAqua = stats?.stok_depot?.Aqua || 0;
  const stokDepotKeran = stats?.stok_depot?.Keran || 0;
  const stokDepotDispenser = stats?.stok_depot?.Dispenser || 0;
  const totalSisaDepot = stokDepotAqua + stokDepotKeran + stokDepotDispenser;

  // Total Aset Galon
  const totalAsetGalon = (stats?.stok_di_pelanggan?.total_keseluruhan || 0) + totalSisaDepot;

  return (
    <div className="p-10 bg-[#FFFFFF] min-h-screen text-slate-900 font-sans">
      
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Operasional</h1>
        <p className="text-slate-500 text-sm mt-1">Ringkasan performa manajemen depot air minum (Data 1 Bulan Terakhir)</p>
      </div>

      {/* Kartu Indikator Atas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <EmbossedCard title="TOTAL PENDAPATAN" value={`Rp ${stats.transaksi.total_omset_minggu_lalu.toLocaleString()}`} />
        <EmbossedCard title="VOLUME GALON KELUAR" value={stats.transaksi.total_galon_keluar_minggu_lalu} />
        <EmbossedCard title="TOTAL PELANGGAN" value={stats.pelanggan.total} />
        <EmbossedCard title="RATA-RATA TRANS/HARI" value={stats.transaksi.rata_rata_minggu_ini.toFixed(1)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Panel Gabungan Stok Pelanggan, Depot, & Total Aset */}
        <div className="bg-slate-50 border border-slate-200 p-8 rounded-2xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] flex flex-col justify-between space-y-8">
          
          <div>
            {/* BAGIAN 1: INVENTARIS STOK DI PELANGGAN */}
            <div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Inventaris Stok di Pelanggan</h3>
              <div className="space-y-4">
                <StockItem label="Aqua" value={stats.stok_di_pelanggan.saldo_aqua} />
                <StockItem label="Keran" value={stats.stok_di_pelanggan.saldo_keran} />
                <StockItem label="Dispenser" value={stats.stok_di_pelanggan.saldo_dispenser} />
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-end">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Beredar</span>
                <span className="text-2xl font-extrabold text-blue-600">
                  {stats.stok_di_pelanggan.total_keseluruhan}
                </span>
              </div>
            </div>

            {/* BAGIAN 2: JUMLAH STOK GALON DI DEPOT */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Jumlah Stok Galon di Depot</h3>
              <div className="space-y-4">
                <StockItem label="Aqua" value={stokDepotAqua} />
                <StockItem label="Keran" value={stokDepotKeran} />
                <StockItem label="Dispenser" value={stokDepotDispenser} />
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-between items-end">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sisa Depot</span>
                <span className="text-2xl font-extrabold text-emerald-600">
                  {totalSisaDepot}
                </span>
              </div>
            </div>

            {/* BAGIAN 3: JUMLAH TOTAL ASET GALON */}
            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Aset Galon</span>
                <span className="text-2xl font-extrabold text-slate-900">
                  {totalAsetGalon}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Tabel Data Sebelah Kanan */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <SimpleTable title="10 Transaksi Terbesar" data={stats.pelanggan.top10_terbesar} isCurrency />
          <SimpleTable title="10 Pelanggan Paling Aktif" data={stats.pelanggan.top10_aktif} />
        </div>

      </div>
    </div>
  );
}

// --- Komponen Pendukung ---

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
      <span className="text-xl font-bold text-slate-900">{value}</span>
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