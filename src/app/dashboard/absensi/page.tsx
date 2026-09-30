'use client';
import { useState, useEffect } from 'react';

export default function AbsensiPage() {
  const [pegawai, setPegawai] = useState([]);
  const [selectedPegawai, setSelectedPegawai] = useState('');
  const [periodeAwal, setPeriodeAwal] = useState('');
  const [absensi, setAbsensi] = useState<any[]>([]);
  const [riwayat, setRiwayat] = useState([]);

  useEffect(() => {
    fetch('/api/pegawai').then(res => res.json()).then(setPegawai);
    fetchRiwayat();
  }, []);

  const fetchRiwayat = async () => {
    try {
      const res = await fetch('/api/absensi-list');
      const data = await res.json();
      setRiwayat(data);
    } catch (error) {
      console.error("Gagal memuat riwayat:", error);
    }
  };

  const handleDateChange = (date: string) => {
    setPeriodeAwal(date);
    const start = new Date(date);
    const namaHariList = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const data = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        hari: namaHariList[d.getDay()],
        tanggal: d.toISOString().split('T')[0],
        masuk_kerja: true,
        setengah_hari: false
      };
    });
    setAbsensi(data);
  };

  const toggleMasuk = (i: number, checked: boolean) => {
    const cp = [...absensi];
    cp[i].masuk_kerja = checked;
    if (!checked) cp[i].setengah_hari = false;
    setAbsensi(cp);
  };

  const toggleSetengah = (i: number, checked: boolean) => {
    const cp = [...absensi];
    cp[i].setengah_hari = checked;
    if (checked) cp[i].masuk_kerja = true;
    setAbsensi(cp);
  };

  const handleSimpan = async () => {
    if (!selectedPegawai || !periodeAwal) return alert("Pilih pegawai dan tanggal!");
    const payload = {
      pegawai_id: selectedPegawai,
      periode_awal: periodeAwal,
      periode_akhir: absensi[6].tanggal,
      dataAbsensi: absensi
    };
    try {
      const res = await fetch('/api/absensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        alert("Berhasil!");
        fetchRiwayat();
      } else {
        const errData = await res.json();
        alert("Gagal: " + (errData.error || "Terjadi kesalahan"));
      }
    } catch (e) {
      alert("Terjadi kesalahan jaringan.");
    }
  };

  const handleHapus = async (pegawai_id: any) => {
    if (!confirm("Yakin ingin menghapus semua absensi karyawan ini?")) return;
    const res = await fetch('/api/absensi/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pegawai_id })
    });
    if (res.ok) {
      alert("Data berhasil dihapus!");
      fetchRiwayat();
    } else {
      alert("Gagal menghapus data.");
    }
  };

  // Pengelompokan data berdasarkan karyawan
  // Pengelompokan data dan pengurutan berdasarkan tanggal (Ascending)
  const groupedRiwayat = riwayat.reduce((acc: any, curr: any) => {
    const nama = curr.pegawai?.nama_pegawai || "Tanpa Nama";
    if (!acc[nama]) acc[nama] = { id: curr.pegawai_id, data: [] };
    acc[nama].data.push(curr);
    return acc;
  }, {});

  // Urutkan data berdasarkan tanggal secara menaik (dari lama ke baru)
  Object.keys(groupedRiwayat).forEach((nama) => {
    groupedRiwayat[nama].data.sort((a: any, b: any) => {
      return new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime();
    });
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Absensi Karyawan</h1>
      <div className="bg-white p-4 rounded shadow mb-6">
        <select className="border p-2 w-full mb-3" onChange={(e) => setSelectedPegawai(e.target.value)}>
          <option value="">-- Pilih Karyawan --</option>
          {pegawai.map((p: any) => <option key={p.id} value={p.id}>{p.nama_pegawai}</option>)}
        </select>
        <input type="date" className="border p-2 w-full mb-3" onChange={(e) => handleDateChange(e.target.value)} />
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Hari</th><th className="border p-2">Tanggal</th>
              <th className="border p-2">Masuk</th><th className="border p-2">Setengah Hari</th>
            </tr>
          </thead>
          <tbody>
            {absensi.map((item, i) => (
              <tr key={i}>
                <td className="border p-2 text-center">{item.hari}</td>
                <td className="border p-2 text-center">{item.tanggal}</td>
                <td className="border p-2 text-center"><input type="checkbox" checked={item.masuk_kerja} onChange={(e) => toggleMasuk(i, e.target.checked)} /></td>
                <td className="border p-2 text-center"><input type="checkbox" checked={item.setengah_hari} onChange={(e) => toggleSetengah(i, e.target.checked)} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSimpan} className="bg-green-600 text-white px-4 py-2 mt-4 rounded">Simpan Absensi</button>
      </div>

      <h2 className="text-xl font-bold mb-4">Riwayat Absensi</h2>
      {Object.keys(groupedRiwayat).map((nama: any) => (
        <div key={nama} className="mb-6 bg-white p-4 rounded shadow border">
          <div className="flex justify-between items-center mb-2 border-b pb-2">
            <h3 className="font-bold text-lg">{nama}</h3>
            <button onClick={() => handleHapus(groupedRiwayat[nama].id)} className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600">Hapus Absensi Karyawan Ini</button>
          </div>
          <table className="w-full">
            <thead><tr className="text-left text-sm bg-gray-50"><th className="p-2">Hari</th><th className="p-2">Tanggal</th><th className="p-2">Status</th></tr></thead>
            <tbody>
              {groupedRiwayat[nama].data.map((a: any) => (
                <tr key={a.id} className="border-t">
                  <td className="p-2">{a.hari}</td>
                  <td className="p-2">{new Date(a.tanggal).toLocaleDateString()}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${a.masuk_kerja === 1 ? (a.setengah_hari === 1 ? 'bg-yellow-200' : 'bg-green-200') : 'bg-red-200'}`}>
                      {a.masuk_kerja === 1 ? (a.setengah_hari === 1 ? 'Setengah Hari' : 'Masuk') : 'Tidak Masuk'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}