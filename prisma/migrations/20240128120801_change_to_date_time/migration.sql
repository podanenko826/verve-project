/*
  Warnings:

  - You are about to alter the column `start` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `DateTime(3)`.
  - You are about to alter the column `end` on the `Event` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `Event` MODIFY `start` DATETIME(3) NOT NULL,
    MODIFY `end` DATETIME(3) NOT NULL;
