-- DropIndex
DROP INDEX `Event_accountId_fkey` ON `Event`;

-- AlterTable
ALTER TABLE `Event` ADD COLUMN `description` VARCHAR(255) NOT NULL DEFAULT '';
