import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Ambil daftar karyawan
export async function GET() {
  try {
    const pegawai = await prisma.pegawai.findMany({
      orderBy: { id: 'desc' }
    });
    return NextResponse.json(pegawai);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// POST: Tambah karyawan baru
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nama_pegawai, gaji_harian, jabatan } = body;
    
    // Menggunakan 'status_aktif' sesuai dengan schema.prisma Anda
    const newPegawai = await prisma.pegawai.create({
      data: { 
        nama_pegawai, 
        gaji_harian: parseInt(gaji_harian),
        jabatan: jabatan || '-', 
        status_aktif: "Aktif" // Mengikuti default value di skema Anda
      }
    });
    return NextResponse.json(newPegawai);
  } catch (error) {
    console.error("Error menambah pegawai:", error);
    return NextResponse.json({ error: "Gagal menambah pegawai" }, { status: 500 });
  }
}