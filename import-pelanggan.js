const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'public', 'pelanggan.csv');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const rows = fileContent.split(/\r?\n/).filter(row => row.trim() !== '');

  console.log(`Total baris ditemukan di CSV: ${rows.length}. Memulai import...`);

  let successCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const cols = row.split(';');
    
    if (cols.length < 8) continue;

    const jenis = cols[0]?.trim() || null;
    const nama = cols[1]?.trim() || null;
    const alamat = cols[2]?.trim() || null;
    const wilayah = cols[3]?.trim() || null;
    const no_hp = cols[4]?.trim() || null;
    const saldo_aqua = parseInt(cols[5]) || 0;
    const saldo_keran = parseInt(cols[6]) || 0;
    const saldo_dispenser = parseInt(cols[7]) || 0;

    try {
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
      successCount++;
      // Menampilkan progress setiap 50 data agar tidak macet di terminal
      if (successCount % 50 === 0) {
        console.log(`Berhasil mengimpor ${successCount} data...`);
      }
    } catch (err) {
      console.error(`Gagal pada baris ke-${i + 1} (${nama}):`, err.message);
    }
  }

  console.log(`✅ Selesai! Berhasil mengimpor total ${successCount} data pelanggan ke database.`);
}

main()
  .catch((e) => {
    console.error('❌ Terjadi error saat import:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });