"use client";

export default function LaporanView({ data, tambahPengeluaran }: any) {
  const { 
    totalPendapatan, 
    totalGalon, 
    totalPengeluaran, 
    dailyReport, 
    dari, 
    sampai, 
    pengeluaran 
  } = data;

  // Hitung jumlah hari untuk rata-rata
  const jumlahHari = Object.keys(dailyReport).length || 1;
  const labaBersih = totalPendapatan - totalPengeluaran;
  const rataGalon = (totalGalon / jumlahHari).toFixed(1);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-gray-50/50 min-h-screen print:p-0 print:bg-white">
      
      {/* HEADER LAPORAN */}
      <div className="text-center space-y-1 pb-4 border-b-2 border-gray-900">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">DEPOT AIR MINUM SWEGERRR</h1>
        <p className="text-xl font-medium text-gray-600">Laporan Keuangan Mingguan</p>
        <p className="text-sm text-gray-500 font-semibold italic">
          Periode: {new Date(dari).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})} 
          &nbsp; s/d &nbsp; 
          {new Date(sampai).toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}
        </p>
      </div>

      {/* DASHBOARD RINGKASAN - Menggunakan print:flex untuk menjaga posisi saat cetak */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 print:flex print:flex-row print:gap-4">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center print:flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pendapatan Bersih</p>
          <p className="text-2xl font-black text-green-700 mt-1">Rp {labaBersih.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center print:flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Jumlah Total Galon</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalGalon.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center print:flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rata-rata Galon/Hari</p>
          <p className="text-2xl font-black text-slate-900 mt-1">{rataGalon}</p>
        </div>
      </div>

      {/* FILTER & TOMBOL (Sembunyi saat cetak) */}
      <div className="flex justify-between items-center print:hidden">
        <form method="GET" className="flex gap-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <input type="date" name="dari" defaultValue={dari} className="border p-2 rounded-lg text-sm" />
          <input type="date" name="sampai" defaultValue={sampai} className="border p-2 rounded-lg text-sm" />
          <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800">Filter</button>
        </form>
        <button 
          onClick={() => window.print()} 
          className="bg-white border px-6 py-2 rounded-xl text-sm font-semibold hover:bg-gray-100 shadow-sm transition"
        >
          Cetak PDF
        </button>
      </div>

      {/* REKAP HARIAN */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100"><h4 className="font-bold">Rekap Transaksi Harian</h4></div>
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Tanggal</th>
              <th className="px-6 py-3 text-right">Total Galon</th>
              <th className="px-6 py-3 text-right">Pendapatan (Rp)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {Object.entries(dailyReport).map(([date, d]: any) => (
              <tr key={date} className="hover:bg-gray-50">
                <td className="px-6 py-4">{new Date(date).toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4 text-right font-mono">{d.galon.toLocaleString('id-ID')}</td>
                <td className="px-6 py-4 text-right font-mono">{d.pendapatan.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-emerald-50 text-emerald-900 font-bold">
            <tr>
              <td className="px-6 py-4">TOTAL KOTOR</td>
              <td className="px-6 py-4 text-right">{totalGalon.toLocaleString('id-ID')}</td>
              <td className="px-6 py-4 text-right">{totalPendapatan.toLocaleString('id-ID')}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* PENGELUARAN */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100"><h4 className="font-bold text-red-600">Daftar Pengeluaran</h4></div>
        
        <form action={tambahPengeluaran} className="grid grid-cols-1 md:grid-cols-12 gap-3 p-6 bg-gray-50 border-b border-gray-100 print:hidden">
          <input type="date" name="tanggal" required className="md:col-span-3 border p-2 rounded-lg text-sm" defaultValue={new Date().toISOString().split('T')[0]} />
          <input type="text" name="keterangan" required placeholder="Keterangan..." className="md:col-span-5 border p-2 rounded-lg text-sm" />
          <input type="number" name="nominal" required placeholder="Nominal" className="md:col-span-2 border p-2 rounded-lg text-sm" />
          <button type="submit" className="md:col-span-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700">Simpan</button>
        </form>
        
        <table className="w-full text-left text-sm">
          <tbody className="divide-y divide-gray-50">
            {pengeluaran.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">{p.tanggal.toLocaleDateString('id-ID')}</td>
                <td className="px-6 py-4 font-medium">{p.keterangan}</td>
                <td className="px-6 py-4 text-right font-mono text-red-600">- {Number(p.nominal).toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-red-50 text-red-900 font-bold">
             <tr>
                <td className="px-6 py-4" colSpan={2}>TOTAL PENGELUARAN</td>
                <td className="px-6 py-4 text-right font-mono">{totalPengeluaran.toLocaleString('id-ID')}</td>
             </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}