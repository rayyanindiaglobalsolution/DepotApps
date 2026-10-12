"use client";

import React, { useState, useEffect } from 'react';

export default function SettingGalonPage() {
  const [stokList, setStokList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk menyimpan input angka ketiga jenis galon
  const [formStok, setFormStok] = useState({
    Aqua: 0,
    Keran: 0,
    Dispenser: 0,
  });

  const fetchStok = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/stok-depot');
      const data = await res.json();
      
      // Jika data berupa array dari database
      if (Array.isArray(data) && data.length > 0) {
        setStokList(data);
        
        const newForm = { Aqua: 0, Keran: 0, Dispenser: 0 };
        data.forEach((item: any) => {
          if (item.jenis_galon === 'Aqua') newForm.Aqua = item.jumlah;
          if (item.jenis_galon === 'Keran') newForm.Keran = item.jumlah;
          if (item.jenis_galon === 'Dispenser') newForm.Dispenser = item.jumlah;
        });
        setFormStok(newForm);
      }
    } catch (error) {
      console.error("Gagal memuat stok depot", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStok();
  }, []);

  const handleSimpan = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Simpan ketiga jenis galon secara paralel
      await Promise.all([
        fetch('/api/stok-depot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jenis_galon: 'Aqua', jumlah: formStok.Aqua }),
        }),
        fetch('/api/stok-depot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jenis_galon: 'Keran', jumlah: formStok.Keran }),
        }),
        fetch('/api/stok-depot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jenis_galon: 'Dispenser', jumlah: formStok.Dispenser }),
        }),
      ]);

      alert("Stok depot berhasil disimpan!");
      fetchStok();
    } catch (error) {
      console.error("Error:", error);
      alert("Terjadi kesalahan saat menyimpan stok");
    }
  };

  return (
    <div className="p-8 max-w-5xl space-y-6 text-slate-900 font-sans">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Stok Galon Depot</h1>
        <p className="text-slate-500 text-sm mt-1">Update jumlah stok galon fisik yang tersedia di depot sesuai jenisnya.</p>
      </div>

      {/* Form Input Rapat Kiri Atas */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm max-w-2xl">
        <form onSubmit={handleSimpan} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Input Aqua */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Aqua</label>
              <input 
                type="number" 
                min="0"
                className="w-full border border-slate-300 p-3 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={formStok.Aqua}
                onChange={(e) => setFormStok({ ...formStok, Aqua: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            {/* Input Keran */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Keran</label>
              <input 
                type="number" 
                min="0"
                className="w-full border border-slate-300 p-3 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={formStok.Keran}
                onChange={(e) => setFormStok({ ...formStok, Keran: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

            {/* Input Dispenser */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Dispenser</label>
              <input 
                type="number" 
                min="0"
                className="w-full border border-slate-300 p-3 rounded-xl bg-white font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                value={formStok.Dispenser}
                onChange={(e) => setFormStok({ ...formStok, Dispenser: parseInt(e.target.value) || 0 })}
                required
              />
            </div>

          </div>

          <div>
            <button 
              type="submit" 
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition"
            >
              Simpan Stok Depot
            </button>
          </div>
        </form>
      </div>

      {/* Ringkasan Tabel Stok Depot Saat Ini */}
      <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl shadow-sm max-w-2xl">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Daftar Stok Depot Saat Ini</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
              <th className="pb-3">Jenis Galon</th>
              <th className="pb-3 text-right">Jumlah Fisik di Depot</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {stokList.length === 0 ? (
              <tr><td colSpan={2} className="py-4 text-center text-slate-400">Belum ada data stok depot. Silakan simpan pada form di atas.</td></tr>
            ) : (
              stokList.map((item: any) => (
                <tr key={item.id}>
                  <td className="py-3 font-semibold text-slate-700">{item.jenis_galon}</td>
                  <td className="py-3 text-right font-extrabold text-slate-900">{item.jumlah} Galon</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}