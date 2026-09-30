import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { pegawai_id, periode_awal, periode_akhir, dataAbsensi } = await req.json();
    const pId = parseInt(pegawai_id);

    // 1. Simpan/Update Absensi (Tanpa kolom periode karena tidak ada di schema)
    for (const item of dataAbsensi) {
      const existingAbsensi = await prisma.absensi_pegawai.findFirst({
        where: { pegawai_id: pId, tanggal: new Date(item.tanggal) }
      });

      if (existingAbsensi) {
        await prisma.absensi_pegawai.update({
          where: { id: existingAbsensi.id },
          data: {
            masuk_kerja: item.masuk_kerja ? 1 : 0,
            setengah_hari: item.setengah_hari ? 1 : 0
          }
        });
      } else {
        await prisma.absensi_pegawai.create({
          data: {
            pegawai_id: pId,
            tanggal: new Date(item.tanggal),
            hari: item.hari,
            masuk_kerja: item.masuk_kerja ? 1 : 0,
            setengah_hari: item.setengah_hari ? 1 : 0
          }
        });
      }
    }

    // 2. Hitung Ulang & Update/Insert Rekap Gaji (Gunakan periode hanya untuk perhitungan)
    const pegawai = await prisma.pegawai.findUnique({ where: { id: pId } });
    const absensiList = await prisma.absensi_pegawai.findMany({
      where: {
        pegawai_id: pId,
        tanggal: { gte: new Date(periode_awal), lte: new Date(periode_akhir) }
      }
    });

    let total_hadir = 0;
    let total_setengah = 0;
    let total_hari = 0;

    absensiList.forEach((a) => {
      if (a.masuk_kerja === 1) {
        if (a.setengah_hari === 1) {
          total_setengah++;
          total_hari += 0.5;
        } else {
          total_hadir++;
          total_hari += 1;
        }
      }
    });

    const gajiHarian = Number(pegawai?.gaji_harian || 0);
    const total_gaji = total_hari * gajiHarian;

    const existingRekap = await prisma.rekap_gaji.findFirst({
      where: {
        pegawai_id: pId,
        periode_awal: new Date(periode_awal),
        periode_akhir: new Date(periode_akhir)
      }
    });

    if (existingRekap) {
      await prisma.rekap_gaji.update({
        where: { id: existingRekap.id },
        data: { 
          total_hari_masuk: total_hadir, 
          total_setengah_hari: total_setengah, 
          total_gaji: BigInt(Math.floor(total_gaji)), 
          total_akhir: Math.floor(total_gaji) 
        }
      });
    } else {
      await prisma.rekap_gaji.create({
        data: { 
          pegawai_id: pId, 
          periode_awal: new Date(periode_awal), 
          periode_akhir: new Date(periode_akhir),
          total_hari_masuk: total_hadir, 
          total_setengah_hari: total_setengah, 
          total_gaji: BigInt(Math.floor(total_gaji)),
          total_akhir: Math.floor(total_gaji) 
        }
      });
    }

    return NextResponse.json({ message: "Berhasil" });
  } catch (error) {
    console.error("Error Processing:", error);
    return NextResponse.json({ error: "Gagal memproses" }, { status: 500 });
  }
}