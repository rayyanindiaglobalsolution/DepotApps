"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function SlipGaji() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/gaji/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setData(data);
      });
  }, [id]);

  if (!data) return <div className="p-10">Memuat slip gaji...</div>;

  // Hitung Gaji Pokok murni (total_akhir saat ini dikurangi bonus yang tersimpan)
  const nominalBonus = Number(data.bonus || 0);
  const gajiPokokMurni = Number(data.total_akhir || 0) - nominalBonus;

  // Total diterima yang benar adalah Gaji Pokok Murni + Bonus
  const totalDiterima = gajiPokokMurni + nominalBonus;

  const tanggalHariIni = new Date().toLocaleDateString('id-ID', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  });

  return (
    <div className="p-8 max-w-md mx-auto bg-white border shadow-lg mt-10 print:shadow-none print:border-none">
      {/* HEADER DENGAN LOGO */}
      <div className="flex items-center border-b pb-4 mb-4 gap-4">
        <img src="/maskot.png" alt="Logo" className="w-16 h-16 object-contain" />
        <div className="text-left">
          <h2 className="font-bold text-lg text-blue-700">DEPOT AIR MINUM SWEGERRR</h2>
          <p className="text-[10px] leading-tight">Jl. Pucang - Donomulyo, Talun Sidomulyo RT 01 RW 04 No.15, Kec. Secang, Kabupaten Magelang, 56195</p>
        </div>
      </div>

      <h3 className="text-center font-black text-xl mb-6 underline">SLIP GAJI KARYAWAN</h3>

      {/* DATA KARYAWAN */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between"><span>Nama Karyawan</span><span className="font-bold">{data.pegawai?.nama_pegawai}</span></div>
        <div className="flex justify-between"><span>Jabatan</span><span>{data.pegawai?.jabatan || '-'}</span></div>
        <div className="flex justify-between">
            <span>Periode</span>
            <span className="text-xs">{new Date(data.periode_awal).toLocaleDateString('id-ID')} s/d {new Date(data.periode_akhir).toLocaleDateString('id-ID')}</span>
        </div>
        <div className="flex justify-between"><span>Gaji Harian</span><span>Rp {Number(data.pegawai?.gaji_harian || 0).toLocaleString()}</span></div>
        <div className="border-y py-2 my-2 space-y-1">
            <div className="flex justify-between"><span>Total Hari Kerja</span>
                <div className="text-right">
                    <div>{data.total_hari_masuk} Hari Full</div>
                    <div>{data.total_setengah_hari} Hari Setengah</div>
                </div>
            </div>
        </div>
        {/* Tampilkan Gaji Pokok Murni */}
        <div className="flex justify-between"><span>Gaji Pokok</span><span>Rp {gajiPokokMurni.toLocaleString()}</span></div>
        <div className="flex justify-between text-blue-600"><span>Bonus</span><span>Rp {nominalBonus.toLocaleString()}</span></div>
        <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2 bg-gray-50 p-2">
            <span>Total Diterima</span>
            <span>Rp {totalDiterima.toLocaleString()}</span>
        </div>
      </div>

      {/* FOOTER TANDA TANGAN */}
      <div className="mt-10 text-right space-y-16">
        <div className="text-xs">
            <p>Magelang, {tanggalHariIni}</p>
            <p className="mt-12 font-bold">Manajemen Swegerrr</p>
        </div>
      </div>

      {/* TOMBOL PRINT (Hidden saat diprint) */}
      <div className="flex gap-2 mt-8 print:hidden">
        <button onClick={() => window.print()} className="flex-1 bg-black text-white py-2 rounded hover:bg-gray-800">Print Slip</button>
      </div>
    </div>
  );
}