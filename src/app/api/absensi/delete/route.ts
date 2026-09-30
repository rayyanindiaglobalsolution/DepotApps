import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { pegawai_id } = await req.json();
    const pId = parseInt(pegawai_id);

    // Hapus absensi berdasarkan pegawai_id
    await prisma.absensi_pegawai.deleteMany({
      where: { pegawai_id: pId }
    });

    // Opsional: Hapus juga rekap gaji terkait
    await prisma.rekap_gaji.deleteMany({
      where: { pegawai_id: pId }
    });

    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting:", error);
    return NextResponse.json({ error: "Gagal menghapus data di database" }, { status: 500 });
  }
}