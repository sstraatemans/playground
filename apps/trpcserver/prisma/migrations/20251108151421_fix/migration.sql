/*
  Warnings:

  - You are about to drop the `Serie` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SerieAlbum` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."SerieAlbum" DROP CONSTRAINT "SerieAlbum_albumId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SerieAlbum" DROP CONSTRAINT "SerieAlbum_serieId_fkey";

-- DropTable
DROP TABLE "public"."Serie";

-- DropTable
DROP TABLE "public"."SerieAlbum";

-- CreateTable
CREATE TABLE "Collection" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "startYear" TEXT NOT NULL,
    "endYear" TEXT NOT NULL,
    "wikiURL" TEXT,

    CONSTRAINT "Collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionAlbum" (
    "albumId" INTEGER NOT NULL,
    "collectionId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "image" TEXT,

    CONSTRAINT "CollectionAlbum_pkey" PRIMARY KEY ("albumId","collectionId")
);

-- AddForeignKey
ALTER TABLE "CollectionAlbum" ADD CONSTRAINT "CollectionAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionAlbum" ADD CONSTRAINT "CollectionAlbum_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
