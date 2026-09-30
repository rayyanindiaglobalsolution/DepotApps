"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { simpanTransaksi } from "../../actions/transaksi";

export default function TransaksiForm({ pelanggan }: { pelanggan: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // State untuk pencarian pelanggan
  const [searchPelanggan, setSearchPelanggan] = useState("");
  const [selectedPelangganId, setSelectedPelangganId] = useState("");
  const [selectedPelangganNama, setSelectedPelangganNama] = useState("");
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  // Filter pelanggan berdasarkan ketikan pencarian (nama atau alamat)
  const filteredPelanggan = pelanggan.filter((p) =>
    p.nama.toLowerCase().includes(searchPelanggan.toLowerCase()) ||
    (p.alamat && p.alamat.toLowerCase().includes(searchPelanggan.toLowerCase()))
  );

  // State untuk melacak input produk
  const [formData, setFormData] = useState({
    aqua_keluar: 0, aqua_bonus: 0, aqua_kembali: 0,
    keran_keluar: 0, keran_bonus: 0, keran_kembali: 0,
    dispenser_keluar: 0, dispenser_bonus: 0, dispenser_kembali: 0,
  });

  // Kalkulasi total real-time
  const subAqua = formData.aqua_keluar * 6000;
  const subKeran = formData.keran_keluar * 7000;
  const subDisp = formData.dispenser_keluar * 7000;
  const total = subAqua + subKeran + subDisp;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedPelangganId) {
      alert("Silakan pilih pelanggan terlebih dahulu!");
      return;
    }

    setLoading(true);
    try {
      // Bungkus data manual ke FormData untuk dikirim ke Server Actions
      const form = new FormData();
      form.append("tanggal", (e.currentTarget.elements.namedItem("tanggal") as HTMLInputElement).value);
      form.append("pelanggan_id", selectedPelangganId);
      form.append("total_harga", total.toString());

      ["aqua", "keran", "dispenser"].forEach((p) => {
        form.append(`${p}_keluar`, (formData as any)[`${p}_keluar`].toString());
        form.append(`${p}_bonus`, (formData as any)[`${p}_bonus`].toString());
        form.append(`${p}_kembali`, (formData as any)[`${p}_kembali`].toString());
      });

      const result = await simpanTransaksi(form);
      if (result?.success) {
        alert("Transaksi berhasil disimpan!");
        router.push("/transaksi");
        router.refresh();
      } else {
        alert(result?.error || "Gagal menyimpan transaksi");
      }
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 w-full bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Input Transaksi Harian</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative">
          {/* Input Tanggal */}
          <input
            type="date"
            name="tanggal"
            defaultValue={new Date().toISOString().split("T")[0]}
            className="p-3 border rounded-xl"
            required
          />

          {/* Kolom Pencarian Pelanggan */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari nama atau alamat pelanggan..."
              value={selectedPelangganNama || searchPelanggan}
              onChange={(e) => {
                setSearchPelanggan(e.target.value);
                setSelectedPelangganNama("");
                setSelectedPelangganId("");
                setIsOpenDropdown(true);
              }}
              onFocus={() => setIsOpenDropdown(true)}
              className="w-full p-3 border rounded-xl bg-white"
              required
            />
            {/* Hidden input untuk validasi required form */}
            <input type="hidden" name="pelanggan_id" value={selectedPelangganId} required />

            {/* Dropdown hasil pencarian */}
            {isOpenDropdown && (
              <div className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-lg max-h-60 overflow-y-auto">
                {filteredPelanggan.length > 0 ? (
                  filteredPelanggan.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setSelectedPelangganId(p.id);
                        setSelectedPelangganNama(p.nama);
                        setSearchPelanggan("");
                        setIsOpenDropdown(false);
                      }}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b last:border-b-0"
                    >
                      <p className="font-semibold text-slate-800">{p.nama}</p>
                      <p className="text-xs text-gray-500">{p.alamat || "Tanpa alamat"}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-sm text-gray-500 text-center">Pelanggan tidak ditemukan</div>
                )}
              </div>
            )}
          </div>
        </div>

        <table className="w-full text-center border-collapse mb-6">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3">Jenis</th>
              <th className="p-3">Keluar</th>
              <th className="p-3">Bonus</th>
              <th className="p-3">Kembali</th>
              <th className="p-3">Selisih Stok</th>
              <th className="p-3">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {["Aqua", "Keran", "Dispenser"].map((produk) => {
              const p = produk.toLowerCase();
              const keluar = formData[`${p}_keluar` as keyof typeof formData];
              const bonus = formData[`${p}_bonus` as keyof typeof formData];
              const kembali = formData[`${p}_kembali` as keyof typeof formData];
              const selisih = (keluar + bonus) - kembali;

              return (
                <tr key={produk} className="border-b">
                  <td className="p-3 font-semibold">{produk}</td>
                  <td className="p-3">
                    <input type="number" name={`${p}_keluar`} defaultValue={0} className="w-full p-2 border rounded" 
                      onChange={(e) => setFormData({...formData, [`${p}_keluar`]: parseInt(e.target.value) || 0})} />
                  </td>
                  <td className="p-3">
                    <input type="number" name={`${p}_bonus`} defaultValue={0} className="w-full p-2 border rounded" 
                      onChange={(e) => setFormData({...formData, [`${p}_bonus`]: parseInt(e.target.value) || 0})} />
                  </td>
                  <td className="p-3">
                    <input type="number" name={`${p}_kembali`} defaultValue={0} className="w-full p-2 border rounded" 
                      onChange={(e) => setFormData({...formData, [`${p}_kembali`]: parseInt(e.target.value) || 0})} />
                  </td>
                  <td className="p-3 font-bold text-sm">
                    <span className={selisih > 0 ? "text-green-600" : selisih < 0 ? "text-red-600" : "text-gray-500"}>
                      {selisih > 0 ? `+${selisih} Tambah` : selisih < 0 ? `${selisih} Kurangi` : "0 Balance"}
                    </span>
                  </td>
                  <td className="p-3 font-bold">
                    Rp {produk === "Aqua" ? subAqua.toLocaleString() : produk === "Keran" ? subKeran.toLocaleString() : subDisp.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="bg-green-100 p-4 rounded-xl mb-4">
          <h4 className="text-xl font-bold text-green-800">
            Total Transaksi: Rp {total.toLocaleString()}
          </h4>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-4 rounded-xl font-bold text-white ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Menyimpan..." : "Simpan Transaksi"}
        </button>
      </form>
    </div>
  );
}