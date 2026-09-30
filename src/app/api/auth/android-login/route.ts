import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs"; 

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Log untuk debugging (Cek di terminal VSCode)
    console.log("Login attempt for email:", email);

    // 1. Cari user di database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("User tidak ditemukan");
      return NextResponse.json({ error: "Email tidak terdaftar" }, { status: 401 });
    }

    // --- DEBUGGING: Cek tipe password ---
    console.log("Password dari request:", password);
    console.log("Password dari database:", user.password);

    // 2. Verifikasi password
    // Jika di database password masih teks biasa, gunakan perbandingan langsung
    // Jika di database sudah di-hash, gunakan bcrypt.compare
    
    let isPasswordValid = false;
    
    // Coba deteksi apakah password di DB adalah hash bcrypt atau teks biasa
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
        isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
        // Jika belum di-hash, bandingkan teks biasa
        isPasswordValid = (password === user.password);
        console.log("Menggunakan perbandingan teks biasa (bukan hash)");
    }

    if (!isPasswordValid) {
      console.log("Password tidak cocok");
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // 3. Jika berhasil, kirim data user
    console.log("Login sukses untuk:", user.email);
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}