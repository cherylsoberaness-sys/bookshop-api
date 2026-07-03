-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PUBLISHED', 'SOLD');

-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PUBLISHED';
