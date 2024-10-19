-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_reset_token" TEXT,
ADD COLUMN     "password_reset_token_expires" TIMESTAMP(3),
ADD COLUMN     "password_update_at" TIMESTAMP(3);
