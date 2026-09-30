-- CreateTable
CREATE TABLE `pegawai` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_pegawai` VARCHAR(100) NOT NULL,
    `jabatan` VARCHAR(100) NULL,
    `no_hp` VARCHAR(20) NULL,
    `alamat` TEXT NULL,
    `status_aktif` VARCHAR(20) NULL DEFAULT 'Aktif',
    `tanggal_mulai_kerja` DATE NULL,
    `gaji_harian` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `absensi_pegawai` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pegawai_id` INTEGER NOT NULL,
    `tanggal` DATE NOT NULL,
    `hari` VARCHAR(20) NOT NULL,
    `masuk_kerja` INTEGER NULL DEFAULT 1,
    `setengah_hari` INTEGER NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `pegawai_id`(`pegawai_id`),
    UNIQUE INDEX `absensi_pegawai_pegawai_id_tanggal_key`(`pegawai_id`, `tanggal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rekap_gaji` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pegawai_id` INTEGER NOT NULL,
    `periode_awal` DATE NOT NULL,
    `periode_akhir` DATE NOT NULL,
    `total_hari_masuk` INTEGER NULL DEFAULT 0,
    `total_setengah_hari` INTEGER NULL DEFAULT 0,
    `bonus` INTEGER NULL DEFAULT 0,
    `total_gaji` BIGINT NULL DEFAULT 0,
    `tanggal_rekap` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `total_akhir` INTEGER NULL DEFAULT 0,

    INDEX `pegawai_id`(`pegawai_id`),
    UNIQUE INDEX `rekap_gaji_pegawai_id_periode_awal_periode_akhir_key`(`pegawai_id`, `periode_awal`, `periode_akhir`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATE NOT NULL,
    `pelanggan_id` INTEGER NULL,
    `nama_pelanggan` VARCHAR(200) NULL,
    `total_harga` INTEGER NULL,
    `bonus` VARCHAR(100) NULL,
    `status_verifikasi` VARCHAR(50) NULL,
    `diverifikasi_oleh` VARCHAR(100) NULL,
    `tanggal_verifikasi` DATETIME(0) NULL,

    INDEX `transaksi_pelanggan_id_fkey`(`pelanggan_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `detail_transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaksi_id` INTEGER NULL,
    `produk` VARCHAR(100) NULL,
    `qty_keluar` INTEGER NULL,
    `qty_kembali` INTEGER NULL,
    `harga` INTEGER NULL,
    `subtotal` INTEGER NULL,
    `bonus` INTEGER NOT NULL DEFAULT 0,

    INDEX `detail_transaksi_transaksi_id_fkey`(`transaksi_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pelanggan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jenis` VARCHAR(50) NULL,
    `nama` VARCHAR(100) NULL,
    `alamat` TEXT NULL,
    `wilayah` VARCHAR(100) NULL,
    `no_hp` VARCHAR(20) NULL,
    `saldo_aqua` INTEGER NULL DEFAULT 0,
    `saldo_keran` INTEGER NULL DEFAULT 0,
    `saldo_dispenser` INTEGER NULL DEFAULT 0,
    `lokasi_maps` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `produk` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_produk` VARCHAR(100) NULL,
    `harga` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pengeluaran` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tanggal` DATE NULL,
    `keterangan` VARCHAR(255) NULL,
    `nominal` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL DEFAULT 'user',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `absensi_pegawai` ADD CONSTRAINT `absensi_pegawai_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rekap_gaji` ADD CONSTRAINT `rekap_gaji_pegawai_id_fkey` FOREIGN KEY (`pegawai_id`) REFERENCES `pegawai`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_pelanggan_id_fkey` FOREIGN KEY (`pelanggan_id`) REFERENCES `pelanggan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_transaksi` ADD CONSTRAINT `detail_transaksi_transaksi_id_fkey` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
