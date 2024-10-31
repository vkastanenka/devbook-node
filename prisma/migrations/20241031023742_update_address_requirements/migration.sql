/*
  Warnings:

  - You are about to drop the column `state_name` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `suburb_name` on the `addresses` table. All the data in the column will be lost.
  - You are about to drop the column `user_experience_id` on the `addresses` table. All the data in the column will be lost.
  - Added the required column `state` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `suburb` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Made the column `street_number` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `street_name` on table `addresses` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `addresses` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "addresses" DROP CONSTRAINT "addresses_user_experience_id_fkey";

-- AlterTable
ALTER TABLE "addresses" DROP COLUMN "state_name",
DROP COLUMN "suburb_name",
DROP COLUMN "user_experience_id",
ADD COLUMN     "state" TEXT NOT NULL,
ADD COLUMN     "suburb" TEXT NOT NULL,
ALTER COLUMN "street_number" SET NOT NULL,
ALTER COLUMN "street_name" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;
