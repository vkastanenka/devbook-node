/*
  Warnings:

  - You are about to drop the column `session_token` on the `sessions` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "sessions_session_token_key";

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "session_token";
