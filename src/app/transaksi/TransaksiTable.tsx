"use client";
import { useState, useTransition } from "react";
import { verifikasiTransaksi, koreksiTransaksi } from "@/app/actions/transaksi";

export default function TransaksiTable({ daftarTransaksi }: { daftarTransaksi: any[] }) {
  const [showModal, setShowModal] = useState<any>(null);
  const [isPending, startTransition] = useTransition();

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      await koreksiTransaksi(showModal.id, formData);
      setShowModal(null);
      window.location.reload();
    });
  };

  return (
    <>
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-blue-50 text-blue-900">
          <tr>
            <th className="py-3 px-4">No.</th>
            <th className="py-3 px-4">Tanggal</th>
            <th className="py-3 px-4">Pelanggan</th>
            <th className="py-3 px-4">Detail (K/B/Km = Selisih)</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4">Total</th>
            <th className="py-3 px-4">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {daftarTransaksi.map((t, index) => (
            <tr key={t.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4 font-bold text-gray-500">{index + 1}</td>
              <td className="py-2 px-4">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
              <td className="py-2 px-4">
                <div className="font-semibold">{t.pelanggan?.nama || t.nama_pelanggan}</div>
                <div className="text-[10px] text-gray-400 truncate max-w-36">{t.pelanggan?.alamat || "-"}</div>
              </td>

              <td className="py-2 px-4">
  <div className="flex flex-wrap gap-x-2 text-[12px] font-mono text-gray-800">
    {t.details?.map((d: any, idx: number) => {
      const selisih = (d.qty_keluar + d.bonus) - d.qty_kembali;
      const displaySelisih = selisih > 0 ? `+${selisih}` : selisih;
      
      return (
        <div key={d.id} className="flex items-center">
          {/* Kita beri lebar tetap (misal 22ch) agar posisi | selalu lurus */}
          <div className="flex items-center min-w-[22ch]">
            <span className="font-bold text-gray-900 mr-1.5">
              {d.produk === "Aqua" ? "AQ" : d.produk === "Keran" ? "KER" : "DISP"}
            </span>
            <span className="text-gray-700 font-medium">
              {d.qty_keluar}/{d.bonus}/{d.qty_kembali} = <span className="font-bold">{displaySelisih}</span>
            </span>
          </div>
          
          {/* Pemisah | yang akan selalu sejajar */}
          {idx < t.details.length - 1 && (
            <span className="text-gray-300 font-bold px-2">|</span>
          )}
        </div>
      );
    })}
  </div>
</td>

              <td className="py-2 px-4">
              <span className={`px-2 py-1 rounded text-[10px] font-bold 
                ${t.status_verifikasi === 'disetujui' || t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                  t.status === 'PENDING_VERIFIKASI' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                
                {t.status_verifikasi === 'disetujui' ? 'DISETUJUI' : 
                t.status === 'PENDING_VERIFIKASI' ? 'VERIFIKASI KURIR' : 'PENDING'}
              </span>
            </td>
              <td className="py-2 px-4 font-bold">Rp {Number(t.total_harga).toLocaleString('id-ID')}</td>
              <td className="py-2 px-4 flex gap-2">
                {(t.status_verifikasi !== 'disetujui' && t.status !== 'COMPLETED') && (
                  <form action={async () => { await verifikasiTransaksi(t.id); window.location.reload(); }}>
                    <button type="submit" className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600">Verifikasi</button>
                  </form>
                )}
                <button 
                  onClick={() => setShowModal(t)} 
                  className="bg-yellow-500 text-white px-2 py-1 rounded text-xs hover:bg-yellow-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl">
            <h3 className="font-bold text-lg mb-4 text-blue-600">Edit Transaksi #{showModal.id}</h3>
            
            <div className="space-y-4">
              {showModal.details.map((d: any) => (
                <div key={d.id} className="grid grid-cols-4 gap-2 items-center border-b pb-2">
                  <label className="font-bold text-xs">{d.produk}</label>
                  <div>
                    <label className="text-[10px] text-gray-500">Keluar</label>
                    <input name={`${d.produk.toLowerCase()}_keluar`} defaultValue={d.qty_keluar} type="number" className="w-full border rounded p-1" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500">Kembali</label>
                    <input name={`${d.produk.toLowerCase()}_kembali`} defaultValue={d.qty_kembali} type="number" className="w-full border rounded p-1" />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-500">Bonus</label>
                    <input name={`${d.produk.toLowerCase()}_bonus`} defaultValue={d.bonus} type="number" className="w-full border rounded p-1" />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button 
                type="button" 
                onClick={() => setShowModal(null)} 
                className="px-4 py-2 border rounded hover:bg-gray-100"
                disabled={isPending}
              >
                Batal
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                disabled={isPending}
              >
                {isPending ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}