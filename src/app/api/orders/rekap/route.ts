import { NextResponse } from 'next/server';
import { getRekapTransaksi } from '@/app/actions/transaksi';

export async function GET(request: Request) {
  try {
    // Kita langsung kirim 'request' ke fungsi getRekapTransaksi
    // karena di transaksi.ts Anda sudah menangani pengambilan searchParams
    const result = await getRekapTransaksi(request);
    
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error("!!! ERROR DI ROUTE.TS !!!", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}