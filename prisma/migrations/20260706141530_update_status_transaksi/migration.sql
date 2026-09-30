/*
  Warnings:

  - You are about to drop the column `status_verifikasi` on the `transaksi` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `transaksi` DROP COLUMN `status_verifikasi`,
    ADD COLUMN `galon_kembali` JSON NULL,
    ADD COLUMN `status` ENUM('PENDING_ASSIGN', 'ON_DELIVERY', 'WAITING_FOR_RETURN', 'COMPLETED') NOT NULL DEFAULT 'PENDING_ASSIGN';
