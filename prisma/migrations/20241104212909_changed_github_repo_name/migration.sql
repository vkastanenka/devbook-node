/*
  Warnings:

  - You are about to drop the column `github_repositories` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "github_repositories",
ADD COLUMN     "github_repos" TEXT[];
