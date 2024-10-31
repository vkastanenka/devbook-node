/*
  Warnings:

  - You are about to drop the column `current` on the `user_educations` table. All the data in the column will be lost.
  - You are about to drop the column `current` on the `user_experiences` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "addresses_user_id_user_experience_id_key";

-- DropIndex
DROP INDEX "user_educations_user_id_key";

-- DropIndex
DROP INDEX "user_experiences_user_id_key";

-- AlterTable
ALTER TABLE "user_educations" DROP COLUMN "current";

-- AlterTable
ALTER TABLE "user_experiences" DROP COLUMN "current";

-- CreateIndex
CREATE UNIQUE INDEX "addresses_user_id_key" ON "addresses"("user_id");
