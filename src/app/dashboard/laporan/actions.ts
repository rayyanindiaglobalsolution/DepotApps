"use server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function tambahPengeluaran(formData: FormData) {
  const tanggal = new Date(formData.get("tanggal") as string);
  const keterangan = formData.get("keterangan") as string;
  const nominal = Number(formData.get("nominal"));

  await prisma.pengeluaran.create({ data: { tanggal, keterangan, nominal } });
  revalidatePath("/dashboard/laporan");
}