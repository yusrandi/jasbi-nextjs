-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'MITRA', 'USER') NULL DEFAULT 'ADMIN',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Kategori` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `kategoriId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,
    `unit` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transaksi` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `datetime` VARCHAR(191) NOT NULL,
    `transaksiCode` VARCHAR(191) NOT NULL,
    `customerId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,
    `qty` INTEGER NOT NULL,
    `total` INTEGER NOT NULL,
    `file` VARCHAR(191) NOT NULL,
    `status` ENUM('KERANJANG', 'DIPESAN', 'DITERIMA', 'DIPROSES', 'DIKIRIM', 'SELESAI') NULL DEFAULT 'KERANJANG',
    `createdAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_kategoriId_fkey` FOREIGN KEY (`kategoriId`) REFERENCES `Kategori`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transaksi` ADD CONSTRAINT `Transaksi_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
