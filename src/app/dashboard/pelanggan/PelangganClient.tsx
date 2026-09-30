"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { MapPin, Search } from "lucide-react";

export default function PelangganClient({ initialPelanggan }: { initialPelanggan: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter data secara real-time berdasarkan huruf yang diketik
  const filteredPelanggan = initialPelanggan.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.nama.toLowerCase().includes(query) ||
      (p.wilayah && p.wilayah.toLowerCase().includes(query)) ||
      (p.alamat && p.alamat.toLowerCase().includes(query)) ||
      (p.no_hp && p.no_hp.toLowerCase().includes(query))
    );
  });

  return (
    <div>
      {/* Kolom Pencarian Real-time */}
      <div className="mb-6 relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari nama, wilayah, alamat, atau no HP..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-800 border-b border-blue-100">
                <th className="p-4">No</th>
                <th className="p-4">Jenis</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Wilayah</th>
                <th className="p-4">No HP</th>
                <th className="p-4">Saldo</th>
                <th className="p-4">Digitasi</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPelanggan.length > 0 ? (
                filteredPelanggan.map((p, index) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">{index + 1}</td>
                    <td className="p-4">{p.jenis}</td>
                    <td className="p-4 font-semibold text-gray-800">{p.nama}</td>
                    <td className="p-4">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold">
                        {p.wilayah}
                      </span>
                    </td>
                    <td className="p-4">{p.no_hp || "-"}</td>
                    <td className="p-4 space-y-1">
                      <div className="flex gap-1 text-[11px] font-bold">
                        <span className="bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded">A:{p.saldo_aqua}</span>
                        <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded">K:{p.saldo_keran}</span>
                        <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">D:{p.saldo_dispenser}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {p.lokasi_maps ? (
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${p.lokasi_maps}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 font-bold text-emerald-600 hover:text-emerald-800 transition"
                        >
                          <MapPin size={18} />
                          <span className="text-xs underline">Sudah diisi</span>
                        </a>
                      ) : (
                        <div className="flex items-center gap-2 font-bold text-red-500">
                          <MapPin size={18} />
                          <span className="text-xs">Belum diisi</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link 
                          href={`/dashboard/pelanggan/edit/${p.id}`} 
                          className="bg-amber-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-amber-600"
                        >
                          Edit
                        </Link>
                        <DeleteButton id={p.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500 text-sm">
                    Data pelanggan tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}