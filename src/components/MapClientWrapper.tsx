"use client";

import dynamic from "next/dynamic";

// dynamic import dengan ssr: false aman dilakukan di dalam Client Component
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-gray-50 flex items-center justify-center rounded-2xl border text-gray-500 font-medium">
      Memuat Peta Sebaran Pelanggan...
    </div>
  ),
});

export default function MapClientWrapper({ dataPelanggan }: { dataPelanggan: any[] }) {
  return <MapComponent dataPelanggan={dataPelanggan} />;
}