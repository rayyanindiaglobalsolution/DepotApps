import prisma from "@/lib/prisma";
import MapClientWrapper from "@/components/MapClientWrapper";

export default async function PetaPelangganPage() {
  const pelanggan = await prisma.pelanggan.findMany({
    orderBy: { id: "desc" },
  });

  return (
    <div className="px-6 pt-0 pb-4 space-y-1">
      {/* Header dinaikkan dengan negative margin atas agar sejajar di atas peta */}
      <div className="-mt-1">
        <h1 className="text-lg font-bold text-slate-900">Peta Sebaran Pelanggan</h1>
        <p className="text-[11px] text-gray-500">Monitor lokasi geografis, wilayah, dan status saldo inventaris galon.</p>
      </div>

      <MapClientWrapper dataPelanggan={pelanggan} />
    </div>
  );
}