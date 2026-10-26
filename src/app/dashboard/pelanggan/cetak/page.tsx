import prisma from "@/lib/prisma";
import CetakContent from "./CetakContent";

export default async function CetakPelangganPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; wilayah?: string; jenis?: string }> | any;
}) {
  const resolvedParams = await searchParams;
  const search = (resolvedParams?.search || "").toLowerCase();
  const selectedWilayah = resolvedParams?.wilayah || "ALL";
  const selectedJenis = resolvedParams?.jenis || "ALL";

  // Mengambil data langsung dari database menggunakan Prisma (sama seperti halaman utama)
  const pelanggan = await prisma.pelanggan.findMany({
    orderBy: { id: "desc" },
  });

  // Filter data langsung di server sesuai parameter yang dipilih
  const filtered = pelanggan.filter((p) => {
    const matchSearch =
      !search ||
      p.nama?.toLowerCase().includes(search) ||
      p.wilayah?.toLowerCase().includes(search) ||
      p.alamat?.toLowerCase().includes(search) ||
      p.no_hp?.toLowerCase().includes(search);

    const matchWilayah =
      selectedWilayah === "ALL" || p.wilayah === selectedWilayah;

    const jenisDb = p.jenis?.trim().toLowerCase() || "";
    const matchJenis =
      selectedJenis === "ALL" ||
      (selectedJenis === "Usaha" && jenisDb.includes("usaha")) ||
      (selectedJenis === "Rumah Tangga" && jenisDb.includes("rumah"));

    return matchSearch && matchWilayah && matchJenis;
  });

  return <CetakContent data={filtered} wilayah={selectedWilayah} jenis={selectedJenis} />;
}