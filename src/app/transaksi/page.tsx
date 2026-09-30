import prisma from "@/lib/prisma";
import Link from "next/link";
import TransaksiTable from "./TransaksiTable";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ dari?: string, sampai?: string }> }) {
  const params = await searchParams;
  
  const hariIni = new Date().toISOString().split("T")[0];
  const dari = params.dari || hariIni;
  const sampai = params.sampai || hariIni;

  // Mengambil data dengan rentang waktu yang mencakup seluruh hari
  const daftarTransaksi = await prisma.transaksi.findMany({
    where: {
      tanggal: {
        gte: new Date(`${dari}T00:00:00`),
        lte: new Date(`${sampai}T23:59:59`), 
      }
    },
    include: { pelanggan: true, details: true },
    orderBy: { tanggal: 'desc' }
  });

  const transaksiDisetujui = daftarTransaksi.filter((t) => t.status_verifikasi === 'disetujui' || t.status === 'COMPLETED');
  const totalPendapatan = transaksiDisetujui.reduce((acc, t) => acc + (Number(t.total_harga) || 0), 0);
  
  const totalGalon = transaksiDisetujui.reduce((acc, t) => 
    acc + (t.details?.reduce((sum, d) => 
      sum + ((Number(d.qty_keluar ?? 0) + Number(d.bonus ?? 0)) - Number(d.qty_kembali ?? 0)), 0) || 0), 0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-600">Riwayat Transaksi</h2>
          <p className="text-gray-500">Rentang: {dari} s/d {sampai}</p>
        </div>
        <Link href="/transaksi/input" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700">
          + Input Transaksi
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <form method="GET" className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium mb-1">Dari Tanggal</label>
            <input type="date" name="dari" defaultValue={dari} className="p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Sampai Tanggal</label>
            <input type="date" name="sampai" defaultValue={sampai} className="p-2 border rounded-lg" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Tampilkan
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
          <p className="text-green-700 text-sm">Pendapatan (Disetujui)</p>
          <h4 className="text-2xl font-bold">Rp {totalPendapatan.toLocaleString('id-ID')}</h4>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
          <p className="text-blue-700 text-sm">Total Galon Keluar</p>
          <h4 className="text-2xl font-bold">{totalGalon.toLocaleString('id-ID')} Galon</h4>
        </div>
        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
          <p className="text-yellow-700 text-sm">Total Transaksi</p>
          <h4 className="text-2xl font-bold">{daftarTransaksi.length.toLocaleString('id-ID')}</h4>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <TransaksiTable daftarTransaksi={daftarTransaksi} />
      </div>
    </div>
  );
}