/*
  Warnings:

  - You are about to drop the column `numbenamer` on the `Serie` table. All the data in the column will be lost.
  - Added the required column `name` to the `Serie` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Serie" DROP COLUMN "numbenamer",
ADD COLUMN     "name" TEXT NOT NULL;
