/*
  Warnings:

  - Made the column `start_year` on table `user_educations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `start_year` on table `user_experiences` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "user_educations" ALTER COLUMN "start_year" SET NOT NULL;

-- AlterTable
ALTER TABLE "user_experiences" ALTER COLUMN "start_year" SET NOT NULL;
