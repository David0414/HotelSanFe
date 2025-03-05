-- CreateTable
CREATE TABLE `Imagen` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(191) NOT NULL,
    `habitacionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Imagen` ADD CONSTRAINT `Imagen_habitacionId_fkey` FOREIGN KEY (`habitacionId`) REFERENCES `Habitacion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
