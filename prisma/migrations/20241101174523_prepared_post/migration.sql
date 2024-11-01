/*
  Warnings:

  - You are about to drop the `posts_comments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[parent_comment_id,post_id,user_id]` on the table `comments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `post_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "posts_comments" DROP CONSTRAINT "posts_comments_comment_id_fkey";

-- DropForeignKey
ALTER TABLE "posts_comments" DROP CONSTRAINT "posts_comments_post_id_fkey";

-- DropIndex
DROP INDEX "comments_user_id_parent_comment_id_key";

-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "post_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "posts_comments";

-- CreateIndex
CREATE UNIQUE INDEX "comments_parent_comment_id_post_id_user_id_key" ON "comments"("parent_comment_id", "post_id", "user_id");

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
