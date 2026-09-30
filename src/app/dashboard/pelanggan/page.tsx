import prisma from "@/lib/prisma";
import Link from "next/link";
import ToastHandler from "@/components/ToastHandler";
import PelangganClient from "./PelangganClient";

export default async function DataPelangganPage() {
  const pelanggan = await prisma.pelanggan.findMany({
    orderBy: { id: 'desc' }
  });

  return (
    <div className="p-8">
      <ToastHandler />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Data Pelanggan</h1>
          <p className="text-gray-500">Manajemen Data Pelanggan Depot</p>
        </div>
        <Link 
          href="/dashboard/pelanggan/tambah" 
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition font-semibold"
        >
          + Tambah Pelanggan
        </Link>
      </div>

      <PelangganClient initialPelanggan={pelanggan} />
    </div>
  );
}