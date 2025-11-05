/*
  Warnings:

  - You are about to drop the `_AlbumCharacter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_SerieAlbum` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_AlbumCharacter" DROP CONSTRAINT "_AlbumCharacter_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AlbumCharacter" DROP CONSTRAINT "_AlbumCharacter_B_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SerieAlbum" DROP CONSTRAINT "_SerieAlbum_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_SerieAlbum" DROP CONSTRAINT "_SerieAlbum_B_fkey";

-- DropIndex
DROP INDEX "public"."AlbumCharacter_albumId_characterId_key";

-- DropIndex
DROP INDEX "public"."SerieAlbum_albumId_serieId_key";

-- DropTable
DROP TABLE "public"."_AlbumCharacter";

-- DropTable
DROP TABLE "public"."_SerieAlbum";
