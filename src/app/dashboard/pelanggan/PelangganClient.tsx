"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";
import { MapPin, Search, ChevronLeft, ChevronRight, Filter } from "lucide-react";

export default function PelangganClient({ initialPelanggan }: { initialPelanggan: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWilayah, setSelectedWilayah] = useState("ALL");
  const [selectedJenis, setSelectedJenis] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  // Mengambil daftar wilayah unik secara otomatis dari data
  const daftarWilayah = Array.from(
    new Set(initialPelanggan.map((p) => p.wilayah).filter(Boolean))
  );

  // Mengambil daftar jenis unik secara bersih (hanya 2 jenis: Usaha & Rumah Tangga)
  const daftarJenis = Array.from(
    new Set(
      initialPelanggan
        .map((p) => p.jenis?.trim())
        .filter(Boolean)
        .map((j) => {
          const lower = j.toLowerCase();
          if (lower.includes("usaha")) return "Usaha";
          if (lower.includes("rumah")) return "Rumah Tangga";
          return j;
        })
    )
  );

  // Filter data berdasarkan pencarian teks, pilihan wilayah, dan jenis pelanggan (kebal huruf besar/kecil)
  const filteredPelanggan = initialPelanggan.filter((p) => {
    const query = searchQuery.toLowerCase();
    const matchSearch =
      p.nama.toLowerCase().includes(query) ||
      (p.wilayah && p.wilayah.toLowerCase().includes(query)) ||
      (p.alamat && p.alamat.toLowerCase().includes(query)) ||
      (p.no_hp && p.no_hp.toLowerCase().includes(query));

    const matchWilayah =
      selectedWilayah === "ALL" || p.wilayah === selectedWilayah;

    const jenisDb = p.jenis?.trim().toLowerCase() || "";
    const matchJenis =
      selectedJenis === "ALL" || 
      (selectedJenis === "Usaha" && jenisDb.includes("usaha")) ||
      (selectedJenis === "Rumah Tangga" && jenisDb.includes("rumah"));

    return matchSearch && matchWilayah && matchJenis;
  });

  // Logika Pagination
  const totalPages = Math.ceil(filteredPelanggan.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredPelanggan.slice(startIndex, startIndex + itemsPerPage);

  // Reset ke halaman 1 jika melakukan pencarian atau mengganti filter
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleWilayahChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedWilayah(e.target.value);
    setCurrentPage(1);
  };

  const handleJenisChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedJenis(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Kolom Pencarian & Filter Dropdown (Wilayah & Jenis) */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Cari nama, wilayah, alamat, atau no HP..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm"
          />
        </div>

        {/* Dropdown Filter Jenis Pelanggan */}
        <div className="relative w-full sm:w-52">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Filter size={18} />
          </div>
          <select
            value={selectedJenis}
            onChange={handleJenisChange}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm text-gray-700 cursor-pointer"
          >
            <option value="ALL">Semua Jenis</option>
            {daftarJenis.map((jenis: any, idx) => (
              <option key={idx} value={jenis}>
                {jenis}
              </option>
            ))}
          </select>
        </div>

        {/* Dropdown Filter Wilayah */}
        <div className="relative w-full sm:w-52">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Filter size={18} />
          </div>
          <select
            value={selectedWilayah}
            onChange={handleWilayahChange}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm shadow-sm text-gray-700 cursor-pointer"
          >
            <option value="ALL">Semua Wilayah</option>
            {daftarWilayah.map((wilayah: any, idx) => (
              <option key={idx} value={wilayah}>
                {wilayah}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-800 border-b border-blue-100">
                <th className="p-4">No</th>
                <th className="p-4">Jenis</th>
                <th className="p-4">Nama</th>
                <th className="p-4">Alamat</th>
                <th className="p-4">Wilayah</th>
                <th className="p-4">No HP</th>
                <th className="p-4">Saldo</th>
                <th className="p-4">Digitasi</th>
                <th className="p-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentData.length > 0 ? (
                currentData.map((p, index) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="p-4">{startIndex + index + 1}</td>
                    <td className="p-4">{p.jenis}</td>
                    <td className="p-4 font-semibold text-gray-800">{p.nama}</td>
                    <td className="p-4 text-gray-600 text-sm">{p.alamat || "-"}</td>
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
                  <td colSpan={9} className="p-8 text-center text-gray-500 text-sm">
                    Data pelanggan tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Bagian Navigasi Pagination */}
        {filteredPelanggan.length > 0 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50/50">
            <span className="text-xs text-gray-500">
              Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredPelanggan.length)} dari total {filteredPelanggan.length} data
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} /> Sebelumnya
              </button>
              <span className="text-xs font-bold text-gray-700 px-2">
                Hal. {currentPage} dari {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Selanjutnya <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}