import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { mingguan01, mingguan02 } = await req.json();

    // Mencari apakah sudah ada data target di database
    const existingTarget = await prisma.targetDepot.findFirst();

    // Melakukan upsert (update jika ada, create jika belum ada)
    const target = await prisma.targetDepot.upsert({
      where: { id: existingTarget ? existingTarget.id : 'temp_id_none' },
      update: {
        target_mingguan01: parseInt(mingguan01),
        target_mingguan02: parseInt(mingguan02),
      },
      create: {
        target_mingguan01: parseInt(mingguan01),
        target_mingguan02: parseInt(mingguan02),
      },
    });

    return NextResponse.json({ success: true, target });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menyimpan target" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const target = await prisma.targetDepot.findFirst();
    return NextResponse.json(target || { target_mingguan01: 0, target_mingguan02: 0 });
  } catch (error) {
    return NextResponse.json({ target_mingguan01: 0, target_mingguan02: 0 });
  }
}