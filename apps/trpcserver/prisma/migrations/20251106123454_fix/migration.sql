/*
  Warnings:

  - You are about to drop the column `wikiURL` on the `SerieAlbum` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Serie" ADD COLUMN     "wikiURL" TEXT;

-- AlterTable
ALTER TABLE "SerieAlbum" DROP COLUMN "wikiURL";
