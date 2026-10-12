const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  // Membaca file CSV dari folder public
  const filePath = path.join(__dirname, 'public', 'pelanggan.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Memecah baris berdasarkan Enter (newline)
  const rows = fileContent.split(/\r?\n/).filter(row => row.trim() !== '');

  console.log(`Memproses ${rows} baris data pelanggan...`);

  for (const row of rows) {
    // Karena pemisahnya titik koma (;) sesuai hasil export Excel Anda
    const cols = row.split(';');
    
    if (cols.length < 8) continue; // Lewati jika baris tidak lengkap

    const jenis = cols[0]?.trim() || null;
    const nama = cols[1]?.trim() || null;
    const alamat = cols[2]?.trim() || null;
    const wilayah = cols[3]?.trim() || null;
    const no_hp = cols[4]?.trim() || null;
    const saldo_aqua = parseInt(cols[5]) || 0;
    const saldo_keran = parseInt(cols[6]) || 0;
    const saldo_dispenser = parseInt(cols[7]) || 0;

    // Masukkan ke database menggunakan Prisma
    await prisma.pelanggan.create({
      data: {
        jenis,
        nama,
        alamat,
        wilayah,
        no_hp,
        saldo_aqua,
        saldo_keran,
        saldo_dispenser,
      },
    });
  }

  console.log('✅ Berhasil mengimpor semua data pelanggan ke database!');
}

main()
  .catch((e) => {
    console.error('❌ Terjadi error saat import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });