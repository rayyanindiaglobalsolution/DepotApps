"use server";

import prisma from "@/lib/prisma"; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// FUNGSI SIMPAN PELANGGAN
export async function savePelanggan(formData: FormData) {
  try {
    const data = {
      jenis: formData.get("jenis") as string,
      nama: formData.get("nama") as string,
      alamat: formData.get("alamat") as string,
      wilayah: formData.get("wilayah") as string,
      no_hp: formData.get("no_hp") as string,
      lokasi_maps: formData.get("lokasi_maps") as string,
      saldo_aqua: parseInt(formData.get("saldo_aqua") as string) || 0,
      saldo_keran: parseInt(formData.get("saldo_keran") as string) || 0,
      saldo_dispenser: parseInt(formData.get("saldo_dispenser") as string) || 0,
    };

    await prisma.pelanggan.create({ data });
    revalidatePath("/dashboard/pelanggan");
  } catch (error) {
    console.error("Gagal simpan pelanggan:", error);
    return { error: "Gagal menyimpan data pelanggan." };
  }
  
  // Redirect aman di luar blok try-catch
  redirect("/dashboard/pelanggan?status=success");
}

// FUNGSI UPDATE PELANGGAN
export async function updatePelanggan(id: number, formData: FormData) {
  try {
    await prisma.pelanggan.update({
      where: { id },
      data: {
        jenis: formData.get("jenis") as string,
        nama: formData.get("nama") as string,
        alamat: formData.get("alamat") as string,
        wilayah: formData.get("wilayah") as string,
        no_hp: formData.get("no_hp") as string,
        saldo_aqua: parseInt(formData.get("saldo_aqua") as string) || 0,
        saldo_keran: parseInt(formData.get("saldo_keran") as string) || 0,
        saldo_dispenser: parseInt(formData.get("saldo_dispenser") as string) || 0,
        lokasi_maps: formData.get("lokasi_maps") as string,
      },
    });
    
    revalidatePath("/dashboard/pelanggan");
  } catch (error) {
    console.error("Gagal update pelanggan:", error);
    return { error: "Gagal memperbarui data pelanggan." };
  }
  
  redirect("/dashboard/pelanggan?status=success");
}

// FUNGSI HAPUS
export async function deletePelanggan(id: number) {
  try {
    await prisma.pelanggan.delete({ where: { id } });
    revalidatePath("/dashboard/pelanggan");
    return { success: true };
  } catch (error) {
    return { error: "Gagal menghapus pelanggan (mungkin masih ada transaksi terkait)." };
  }
}