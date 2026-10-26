"use client";

import { useEffect } from "react";

export default function CetakContent({ data, wilayah, jenis }: { data: any[]; wilayah: string; jenis: string }) {
  useEffect(() => {
    if (data.length > 0) {
      window.print();
    }
  }, [data]);

  return (
    <div className="p-6 font-sans text-xs bg-white min-h-screen text-gray-900">
      <style jsx global>{`
        @media print {
          aside, nav, header, footer, .no-print {
            display: none !important;
          }
          body, html {
            background: white !important;
            color: black !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          main, div {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            color: black !important;
          }
          table {
            color: black !important;
          }
        }
      `}</style>

      {/* Tombol interaktif yang otomatis hilang saat dicetak */}
      <div className="no-print mb-4 flex gap-2">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm shadow-sm cursor-pointer"
        >
          Cetak / Simpan PDF
        </button>
        <button
          onClick={() => window.close()}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium text-sm shadow-sm cursor-pointer"
        >
          Tutup Halaman
        </button>
      </div>

      <h2 style={{ textAlign: "center", fontSize: "14px", fontWeight: "bold", marginBottom: "4px", color: "#000" }}>
        LAPORAN DATA PELANGGAN DEPOT AIR MINUM
      </h2>
      <p style={{ textAlign: "center", fontSize: "11px", marginBottom: "15px", color: "#555" }}>
        {wilayah !== "ALL" ? `Wilayah: ${wilayah} ` : "Semua Wilayah "} {jenis !== "ALL" ? `| Jenis: ${jenis}` : ""}
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse", color: "#000" }}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "#333", color: "white", padding: "6px", border: "1px solid #000", textAlign: "center", width: "40px" }}>No</th>
            <th style={{ backgroundColor: "#333", color: "white", padding: "6px", border: "1px solid #000", textAlign: "center" }}>Jenis</th>
            <th style={{ backgroundColor: "#333", color: "white", padding: "6px", border: "1px solid #000", textAlign: "left" }}>Nama Pelanggan</th>
            <th style={{ backgroundColor: "#333", color: "white", padding: "6px", border: "1px solid #000", textAlign: "left" }}>Alamat</th>
            <th style={{ backgroundColor: "#333", color: "white", padding: "6px", border: "1px solid #000", textAlign: "center" }}>Wilayah</th>
            <th style={{ backgroundColor: "#333", color: "white", padding: "6px", border: "1px solid #000", textAlign: "center" }}>No HP</th>
            <th style={{ backgroundColor: "#333", color: "white", padding: "6px", border: "1px solid #000", textAlign: "center" }}>Saldo Galon (A / K / D)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index}>
              <td style={{ padding: "5px", border: "1px solid #000", textAlign: "center", color: "#000" }}>{index + 1}</td>
              <td style={{ padding: "5px", border: "1px solid #000", textAlign: "center", color: "#000" }}>{row.jenis || "-"}</td>
              <td style={{ padding: "5px", border: "1px solid #000", fontWeight: "bold", color: "#000" }}>{row.nama || "-"}</td>
              <td style={{ padding: "5px", border: "1px solid #000", color: "#000" }}>{row.alamat || "-"}</td>
              <td style={{ padding: "5px", border: "1px solid #000", textAlign: "center", color: "#000" }}>{row.wilayah || "-"}</td>
              <td style={{ padding: "5px", border: "1px solid #000", textAlign: "center", color: "#000" }}>{row.no_hp || "-"}</td>
              <td style={{ padding: "5px", border: "1px solid #000", textAlign: "center", color: "#000", fontFamily: "monospace", fontSize: "11px" }}>
                A:{row.saldo_aqua ?? 0} | K:{row.saldo_keran ?? 0} | D:{row.saldo_dispenser ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}