/*
  Warnings:

  - You are about to drop the column `userExperienceId` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `endYear` on the `user_educations` table. All the data in the column will be lost.
  - You are about to drop the column `startYear` on the `user_educations` table. All the data in the column will be lost.
  - You are about to drop the column `endYear` on the `user_experiences` table. All the data in the column will be lost.
  - You are about to drop the column `startYear` on the `user_experiences` table. All the data in the column will be lost.
  - You are about to drop the column `parent_user_id` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id,user_experience_id]` on the table `addresses` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_userExperienceId_fkey";

-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_userId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_parent_user_id_fkey";

-- DropIndex
DROP INDEX "addresses_userId_userExperienceId_key";

-- DropIndex
DROP INDEX "users_parent_user_id_key";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "userExperienceId",
DROP COLUMN "userId",
ADD COLUMN     "user_experience_id" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AlterTable
ALTER TABLE "user_educations" DROP COLUMN "endYear",
DROP COLUMN "startYear",
ADD COLUMN     "end_year" TEXT,
ADD COLUMN     "start_year" TEXT;

-- AlterTable
ALTER TABLE "user_experiences" DROP COLUMN "endYear",
DROP COLUMN "startYear",
ADD COLUMN     "end_year" TEXT,
ADD COLUMN     "start_year" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "parent_user_id";

-- CreateIndex
CREATE UNIQUE INDEX "addresses_user_id_user_experience_id_key" ON "addresses"("user_id", "user_experience_id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_experience_id_fkey" FOREIGN KEY ("user_experience_id") REFERENCES "user_experiences"("id") ON DELETE SET NULL ON UPDATE CASCADE;
