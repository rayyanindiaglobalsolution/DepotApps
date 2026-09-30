-- AlterTable
ALTER TABLE `transaksi` ADD COLUMN `kurir_id` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `TargetDepot` (
    `id` VARCHAR(191) NOT NULL,
    `target_mingguan01` INTEGER NOT NULL,
    `target_mingguan02` INTEGER NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `transaksi_kurir_id_fkey` ON `transaksi`(`kurir_id`);

-- AddForeignKey
ALTER TABLE `transaksi` ADD CONSTRAINT `transaksi_kurir_id_fkey` FOREIGN KEY (`kurir_id`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
