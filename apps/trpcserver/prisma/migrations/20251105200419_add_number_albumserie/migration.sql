/*
  Warnings:

  - Added the required column `number` to the `SerieAlbum` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SerieAlbum" ADD COLUMN     "number" INTEGER NOT NULL;
