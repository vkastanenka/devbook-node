/*
  Warnings:

  - You are about to drop the column `password_reset_token` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password_reset_token_expires` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "password_reset_token",
DROP COLUMN "password_reset_token_expires",
ADD COLUMN     "reset_password_token" TEXT,
ADD COLUMN     "reset_password_token_expires" TIMESTAMP(3);
