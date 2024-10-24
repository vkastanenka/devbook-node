/*
  Warnings:

  - The `github_repositories` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "github_repositories",
ADD COLUMN     "github_repositories" TEXT[];
