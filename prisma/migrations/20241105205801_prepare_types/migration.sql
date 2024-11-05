/*
  Warnings:

  - You are about to drop the column `skills` on the `user_experiences` table. All the data in the column will be lost.
  - You are about to drop the `attachments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_post_id_fkey";

-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_user_id_fkey";

-- AlterTable
ALTER TABLE "user_experiences" DROP COLUMN "skills";

-- DropTable
DROP TABLE "attachments";
