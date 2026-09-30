import prisma from "@/lib/prisma";
import TransaksiForm from "../_components/TransaksiForm";

export default async function InputPage() {
  const pelanggan = await prisma.pelanggan.findMany({
    orderBy: { nama: 'asc' }
  });

  return <TransaksiForm pelanggan={pelanggan} />;
}