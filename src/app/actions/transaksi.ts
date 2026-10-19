"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// --- FUNGSI SIMPAN TRANSAKSI ---
export async function simpanTransaksi(formData: FormData) {
  console.log("DEBUG: simpanTransaksi dipanggil");
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return { success: false, error: "Tidak diizinkan, silakan login kembali." };
  }

  const pelanggan_id = parseInt(formData.get("pelanggan_id") as string);
  const pelanggan = await prisma.pelanggan.findUnique({ where: { id: pelanggan_id } });

  if (!pelanggan) return { success: false, error: "Pelanggan tidak ditemukan." };

  const userRole = (session.user as any)?.role?.toLowerCase() || "";
  const userName = session.user?.name || "Admin"; 
  const isAdmin = true; // Kita set true agar otomatis langsung disetujui & update saldo saat testing
  
  const status_verifikasi = "disetujui";
  
  // Mengambil tanggal dari input form
  const tanggalInput = formData.get("tanggal") as string;
  const tanggal = tanggalInput ? new Date(tanggalInput) : new Date();

  const produkList = [
    { nama: "Aqua", harga: 6000, key: "aqua" },
    { nama: "Keran", harga: 7000, key: "keran" },
    { nama: "Dispenser", harga: 7000, key: "dispenser" },
  ];

  let total_harga = 0;
  const detailsData = produkList.map((p) => {
    const keluar = parseInt(formData.get(`${p.key}_keluar`) as string || "0");
    const kembali = parseInt(formData.get(`${p.key}_kembali`) as string || "0");
    const bonus = parseInt(formData.get(`${p.key}_bonus`) as string || "0");
    const subtotal = keluar * p.harga;
    total_harga += subtotal;

    return { produk: p.nama, qty_keluar: keluar, qty_kembali: kembali, bonus: bonus, harga: p.harga, subtotal: subtotal };
  });
  
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Buat transaksi utama
      await tx.transaksi.create({ 
        data: {
          tanggal,
          pelanggan_id,
          nama_pelanggan: pelanggan.nama,
          total_harga,
          status: "COMPLETED",
          status_verifikasi,
          diverifikasi_oleh: userName,
          tanggal_verifikasi: new Date(),
          details: { create: detailsData },
        } 
      });

      // 2. Loop untuk update saldo pelanggan dan potong stok depot
      for (const item of detailsData) {
        const saldoTambah = (item.qty_keluar + item.bonus) - item.qty_kembali;
        const produk = item.produk.toLowerCase();
        const updateData: any = {};
        
        if (produk === 'aqua') updateData.saldo_aqua = { increment: saldoTambah };
        else if (produk === 'keran') updateData.saldo_keran = { increment: saldoTambah };
        else if (produk === 'dispenser') updateData.saldo_dispenser = { increment: saldoTambah };
        
        // Update saldo pinjaman galon di tabel pelanggan
        if (Object.keys(updateData).length > 0) {
          await tx.pelanggan.update({ where: { id: pelanggan_id }, data: updateData });
        }

        // 3. PENTING: Otomatis kurangi stok fisik galon di tabel StokDepot gudang
        const qtyKeluarFisik = item.qty_keluar + item.bonus;
        if (qtyKeluarFisik > 0) {
          await tx.stokDepot.updateMany({
            where: { jenis_galon: item.produk },
            data: { jumlah: { decrement: qtyKeluarFisik } }
          });
        }
      }
    });

    revalidatePath("/transaksi");
    revalidatePath("/dashboard/pelanggan");
    revalidatePath("/dashboard/setting-galon");
    return { success: true };
  } catch (error) {
    console.error("DEBUG - ERROR SIMPAN:", error);
    return { success: false, error: "Gagal menyimpan transaksi." };
  }
}

// --- FUNGSI VERIFIKASI TRANSAKSI ---
export async function verifikasiTransaksi(id: number) {
  console.log("DEBUG: verifikasiTransaksi dipanggil untuk ID:", id);
  const session = await getServerSession(authOptions);
  const userRole = (session?.user as any)?.role?.toLowerCase() || "";
  
  if (!userRole.includes("admin")) {
    return { success: false, error: "Hanya Admin yang bisa verifikasi!" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const transaksi = await tx.transaksi.findUnique({
        where: { id: String(id) },
        include: { details: true }
      });

      if (!transaksi || (transaksi.status_verifikasi?.toLowerCase() !== 'pending' && transaksi.status !== 'PENDING_VERIFIKASI')) {
  throw new Error("Transaksi sudah diproses atau tidak valid.");
}

      for (const item of transaksi.details) {
        const qtyKeluar = item.qty_keluar ?? 0;
        const qtyKembali = item.qty_kembali ?? 0;
        const bonus = item.bonus ?? 0;
        const produk = (item.produk ?? "").toLowerCase();
        
        const saldoTambah = (qtyKeluar + bonus) - qtyKembali;

        const updateData: any = {};
        if (produk === 'aqua') updateData.saldo_aqua = { increment: saldoTambah };
        else if (produk === 'keran') updateData.saldo_keran = { increment: saldoTambah };
        else if (produk === 'dispenser') updateData.saldo_dispenser = { increment: saldoTambah };

        if (Object.keys(updateData).length > 0 && transaksi.pelanggan_id) {
        await tx.pelanggan.update({
          where: { id: Number(transaksi.pelanggan_id) },
          data: updateData
  });
}
      }

      await tx.transaksi.update({
        where: { id: String(id) },
        data: { 
          status: "COMPLETED",
          status_verifikasi: "disetujui",
          diverifikasi_oleh: session?.user?.name || "Admin",
          tanggal_verifikasi: new Date()
        }
      });
    });
    
    revalidatePath("/transaksi");
    return { success: true };
  } catch (error) {
    console.error("DEBUG - ERROR VERIFIKASI:", error);
    return { success: false, error: "Gagal memverifikasi transaksi." };
  }
}

// --- FUNGSI KOREKSI / EDIT TRANSAKSI ---
export async function koreksiTransaksi(id: string, formData: FormData) {
  console.log("DEBUG: koreksiTransaksi dipanggil untuk ID:", id);
  
  const session = await getServerSession(authOptions);
  if (!session) return { success: false, error: "Tidak diizinkan." };

  try {
    await prisma.$transaction(async (tx) => {
      const oldTransaksi = await tx.transaksi.findUnique({
        where: { id: String(id) },
        include: { details: true }
      });

      if (!oldTransaksi) throw new Error("Transaksi tidak ditemukan.");

      if (oldTransaksi.status_verifikasi === 'disetujui') {
        for (const item of oldTransaksi.details) {
          const qtyKeluar = item.qty_keluar ?? 0;
          const qtyBonus = item.bonus ?? 0;
          const qtyKembali = item.qty_kembali ?? 0;
          
          const saldoKurang = (qtyKeluar + qtyBonus) - qtyKembali;
          const produk = (item.produk || "").toLowerCase();
          const updateData: any = {};

          if (produk === 'aqua') updateData.saldo_aqua = { decrement: saldoKurang };
          else if (produk === 'keran') updateData.saldo_keran = { decrement: saldoKurang };
          else if (produk === 'dispenser') updateData.saldo_dispenser = { decrement: saldoKurang };

          if (Object.keys(updateData).length > 0 && oldTransaksi.pelanggan_id) {
            await tx.pelanggan.update({ 
              where: { id: oldTransaksi.pelanggan_id }, 
              data: updateData 
            });
          }
        }
      }

      await tx.detail_transaksi.deleteMany({ where: { transaksi_id: id } });

      const produkList = [
        { nama: "Aqua", harga: 6000, key: "aqua" },
        { nama: "Keran", harga: 7000, key: "keran" },
        { nama: "Dispenser", harga: 7000, key: "dispenser" },
      ];

      let total_harga = 0;
  const detailsData = produkList.map((p) => {
    const keluar = parseInt(formData.get(`${p.key}_keluar`) as string || "0");
    const kembali = parseInt(formData.get(`${p.key}_kembali`) as string || "0");
    const bonus = parseInt(formData.get(`${p.key}_bonus`) as string || "0");
    
    // RUMUS HARGA: Konsisten hanya dari qty_keluar * harga
    const subtotal = keluar * p.harga; 
    total_harga += subtotal;

    return { 
      produk: p.nama, 
      qty_keluar: keluar, 
      qty_kembali: kembali, 
      bonus: bonus, 
      harga: p.harga, 
      subtotal: subtotal 
    };
  });

      await tx.transaksi.update({
        where: { id: String(id) },
        data: {
          total_harga,
          status_verifikasi: "pending",
          diverifikasi_oleh: null,
          tanggal_verifikasi: null,
          details: { create: detailsData }
        }
      });
    });

    revalidatePath("/transaksi");
    return { success: true };
  } catch (error) {
    console.error("DEBUG - ERROR KOREKSI:", error);
    return { success: false, error: "Gagal menyimpan perubahan." };
  }
}

// --- TAMBAHKAN FUNGSI REKAP TRANSAKSI DI BAWAH FILE INI ---
export async function getRekapTransaksi(request: Request) {
  const { searchParams } = new URL(request.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Pengecekan sesi sengaja dinonaktifkan untuk testing Android
  try {
    console.log("--- Sedang mengambil data rekap transaksi (TANPA SESI) ---");

    // Membuat objek filter dinamis
    const whereClause: any = { status: 'COMPLETED' };

    // Jika parameter tanggal ada, tambahkan ke dalam filter
    if (startDate && endDate) {
      whereClause.tanggal = {
        gte: new Date(startDate), // Mengambil data mulai dari startDate
        lte: new Date(endDate)    // Mengambil data sampai dengan endDate
      };
      console.log(`Filter aktif: ${startDate} sampai ${endDate}`);
    }

    // Mengambil data dengan filter yang sudah disiapkan
    const data = await prisma.transaksi.findMany({
      where: whereClause,
      include: { 
        details: true,
        pelanggan: true 
      },
      orderBy: { tanggal: 'desc' }
    });

    return { 
      success: true, 
      data: { transactions: data } 
    };

  } catch (error: any) {
    // Logging detail ke terminal VS Code agar mudah dilacak
    console.error("!!! ERROR CRITICAL DI SERVER !!!");
    console.error("Message:", error.message);
    
    return { 
      success: false, 
      error: error.message || "Terjadi kesalahan internal pada server." 
    };
  }
}