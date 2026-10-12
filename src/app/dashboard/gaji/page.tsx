"use client";

import React, { useState, useEffect } from 'react';

export default function GajiPage() {
  const [activeTab, setActiveTab] = useState('gaji');
  const [dataGaji, setDataGaji] = useState([]);
  const [dataPegawai, setDataPegawai] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  const [bonusData, setBonusData] = useState({ id: '', bonus: 0 });
  const [pegawaiForm, setPegawaiForm] = useState({ nama_pegawai: '', gaji_harian: '', jabatan: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resGaji, resPegawai] = await Promise.all([
        fetch('/api/gaji').then(res => res.json()),
        fetch('/api/pegawai').then(res => res.json())
      ]);
      
      setDataGaji(resGaji);
      setDataPegawai(resPegawai);
    } catch (error) {
      console.error("Gagal memuat data", error);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSimpanBonus = async () => {
    try {
      const res = await fetch('/api/gaji/bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bonusData),
      });
      if (res.ok) { 
        setShowModal(false); 
        fetchData(); 
        setBonusData({ id: '', bonus: 0 });
      } else { alert("Gagal menyimpan bonus"); }
    } catch (e) { alert("Error koneksi"); }
  };

  const handleTambahPegawai = async () => {
    await fetch('/api/pegawai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pegawaiForm),
    });
    setPegawaiForm({ nama_pegawai: '', gaji_harian: '', jabatan: '' });
    fetchData();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 bg-gray-50/50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Manajemen Payroll</h1>
          <div className="flex gap-6 mt-4 border-b">
            <button onClick={() => setActiveTab('gaji')} className={`pb-2 font-bold ${activeTab === 'gaji' ? 'border-b-2 border-black' : 'text-gray-400'}`}>Rekap Gaji</button>
            <button onClick={() => setActiveTab('karyawan')} className={`pb-2 font-bold ${activeTab === 'karyawan' ? 'border-b-2 border-black' : 'text-gray-400'}`}>Data Karyawan</button>
          </div>
        </div>
      </div>

      {activeTab === 'gaji' && (
        <div className="space-y-4">
          <button onClick={() => setShowModal(true)} className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold">+ Bonus Karyawan</button>
          <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 uppercase text-[10px] text-gray-500">
                <tr>
                    <th className="p-4">Nama</th>
                    <th className="p-4">Jabatan</th>
                    <th className="p-4">Periode</th>
                    <th className="p-4 text-center">Full</th>
                    <th className="p-4 text-center">Setengah</th>
                    <th className="p-4">Gaji Pokok</th>
                    <th className="p-4">Bonus</th>
                    <th className="p-4">Total Diterima</th>
                    <th className="p-4">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                {dataGaji.map((k: any) => {
                  const totalAkhir = Number(k.total_akhir || 0);
                  const bonus = Number(k.bonus || 0);
                  // Hitung gaji pokok murni dari total_akhir dikurangi bonus
                  const gajiPokokMurni = totalAkhir - bonus;

                  return (
                    <tr key={k.id}>
                      <td className="p-4 font-bold">{k.pegawai?.nama_pegawai}</td>
                      <td className="p-4">{k.pegawai?.jabatan || '-'}</td>
                      <td className="p-4">
                        {new Date(k.periode_awal).toLocaleDateString('id-ID')} <br/> 
                        s/d {new Date(k.periode_akhir).toLocaleDateString('id-ID')}
                      </td>
                      <td className="p-4 text-center">{k.total_hari_masuk}</td>
                      <td className="p-4 text-center">{k.total_setengah_hari}</td>
                      <td className="p-4 font-semibold">Rp {gajiPokokMurni.toLocaleString()}</td>
                      <td className="p-4 text-blue-600 font-bold">Rp {bonus.toLocaleString()}</td>
                      <td className="p-4 font-black text-emerald-600">Rp {totalAkhir.toLocaleString()}</td>
                      <td className="p-4">
                        <button onClick={() => window.open(`/dashboard/gaji/slip/${k.id}`, '_blank')} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition">Cetak Slip</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'karyawan' && (
        <div className="space-y-6">
          <div className="flex gap-4 bg-white p-4 rounded-xl border flex-wrap">
            <input placeholder="Nama" className="border p-2 rounded flex-1" onChange={e => setPegawaiForm({...pegawaiForm, nama_pegawai: e.target.value})} value={pegawaiForm.nama_pegawai}/>
            <input placeholder="Jabatan" className="border p-2 rounded flex-1" onChange={e => setPegawaiForm({...pegawaiForm, jabatan: e.target.value})} value={pegawaiForm.jabatan}/>
            <input type="number" placeholder="Gaji Harian" className="border p-2 rounded flex-1" onChange={e => setPegawaiForm({...pegawaiForm, gaji_harian: e.target.value})} value={pegawaiForm.gaji_harian}/>
            <button onClick={handleTambahPegawai} className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Tambah Pegawai</button>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <table className="w-full text-left">
              <thead><tr className="border-b"><th className="p-4">Nama</th><th className="p-4">Jabatan</th><th className="p-4">Gaji Harian</th></tr></thead>
              <tbody>{dataPegawai.map((p: any) => (
                <tr key={p.id} className="border-b"><td className="p-4">{p.nama_pegawai}</td><td className="p-4">{p.jabatan || '-'}</td><td className="p-4">Rp {Number(p.gaji_harian).toLocaleString()}</td></tr>
              ))}</tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4 shadow-xl">
            <h2 className="text-xl font-bold">Input Bonus Karyawan</h2>
            <select className="w-full border p-2 rounded" onChange={(e) => setBonusData({...bonusData, id: e.target.value})}>
              <option value="">Pilih Karyawan</option>
              {dataGaji.map((k: any) => <option key={k.id} value={k.id}>{k.pegawai?.nama_pegawai}</option>)}
            </select>
            <input type="number" placeholder="Nominal Bonus" className="w-full border p-2 rounded" onChange={e => setBonusData({...bonusData, bonus: parseInt(e.target.value) || 0})} />
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="flex-1 p-2 border rounded">Batal</button>
              <button onClick={handleSimpanBonus} className="flex-1 p-2 bg-blue-600 text-white rounded">Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}