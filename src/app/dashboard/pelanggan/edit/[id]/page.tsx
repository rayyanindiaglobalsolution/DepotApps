import prisma from "@/lib/prisma";
import { updatePelanggan } from "@/app/actions/pelanggan";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function EditPelangganPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: rawId } = await params;
  const id = parseInt(rawId);
  
  const pelanggan = await prisma.pelanggan.findUnique({
    where: { id }
  });

  if (!pelanggan) notFound();

  let jenisNormalized = "Rumah Tangga";
  if (pelanggan.jenis) {
    const lower = pelanggan.jenis.trim().toLowerCase();
    if (lower.includes("usaha")) {
      jenisNormalized = "Usaha";
    } else if (lower.includes("rumah")) {
      jenisNormalized = "Rumah Tangga";
    }
  }

  const updatePelangganWithId = updatePelanggan.bind(null, id);

  // Fungsi pembungkus untuk mengatasi error tipe data action form
  async function handleSubmit(formData: FormData) {
    "use server";
    await updatePelangganWithId(formData);
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Pelanggan</h1>
      
      {/* Gunakan handleSubmit di sini */}
      <form action={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Jenis Pelanggan</label>
            <select name="jenis" defaultValue={jenisNormalized} className="w-full p-3 border rounded-xl">
              <option value="Rumah Tangga">Rumah Tangga</option>
              <option value="Usaha">Usaha</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Nama Pelanggan</label>
            <input type="text" name="nama" defaultValue={pelanggan.nama || ""} className="w-full p-3 border rounded-xl" required />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Alamat</label>
          <textarea name="alamat" defaultValue={pelanggan.alamat || ""} rows={3} className="w-full p-3 border rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Wilayah</label>
            <input type="text" name="wilayah" defaultValue={pelanggan.wilayah || ""} className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">No HP</label>
            <input type="text" name="no_hp" defaultValue={pelanggan.no_hp || ""} className="w-full p-3 border rounded-xl" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-t pt-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Saldo Aqua</label>
            <input type="number" name="saldo_aqua" defaultValue={pelanggan.saldo_aqua || 0} className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Saldo Keran</label>
            <input type="number" name="saldo_keran" defaultValue={pelanggan.saldo_keran || 0} className="w-full p-3 border rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Saldo Dispenser</label>
            <input type="number" name="saldo_dispenser" defaultValue={pelanggan.saldo_dispenser || 0} className="w-full p-3 border rounded-xl" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Koordinat Lokasi</label>
          <textarea name="lokasi_maps" defaultValue={pelanggan.lokasi_maps || ""} rows={2} className="w-full p-3 border rounded-xl" placeholder="-3.325420,114.590122" />
        </div>

        <div className="pt-4 flex gap-2">
          <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700">
            Update Data
          </button>
          <Link href="/dashboard/pelanggan" className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-bold hover:bg-gray-300">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}