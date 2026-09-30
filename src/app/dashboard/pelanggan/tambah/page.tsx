import { savePelanggan } from "@/app/actions/pelanggan";
import Link from "next/link";

export default function TambahPelanggan() {
  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Pelanggan</h1>
        <p className="text-gray-500">Input data pelanggan baru depot</p>
      </div>

      {/* @ts-ignore */}
      <form action={savePelanggan} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Jenis Pelanggan</label>
            <select name="jenis" className="w-full p-3 border rounded-xl" required>
              <option value="Rumah Tangga">Rumah Tangga</option>
              <option value="Usaha">Usaha</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Nama Pelanggan</label>
            <input type="text" name="nama" className="w-full p-3 border rounded-xl" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Alamat</label>
          <textarea name="alamat" rows={3} className="w-full p-3 border rounded-xl" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Wilayah</label>
            <input type="text" name="wilayah" className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">No HP</label>
            <input type="text" name="no_hp" className="w-full p-3 border rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Saldo Aqua</label>
            <input type="number" name="saldo_aqua" defaultValue={0} className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Saldo Keran</label>
            <input type="number" name="saldo_keran" defaultValue={0} className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Saldo Dispenser</label>
            <input type="number" name="saldo_dispenser" defaultValue={0} className="w-full p-3 border rounded-xl" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Koordinat Lokasi</label>
          <textarea name="lokasi_maps" rows={2} className="w-full p-3 border rounded-xl" placeholder="-3.325420,114.590122" />
        </div>

        <div className="pt-4 flex gap-3">
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition">
            Simpan Pelanggan
          </button>
          <Link href="/dashboard/pelanggan" className="bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}