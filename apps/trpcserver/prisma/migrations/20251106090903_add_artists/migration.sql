-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "drawArtistId" INTEGER,
ADD COLUMN     "scenarioArtistId" INTEGER;

-- CreateTable
CREATE TABLE "Artist" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_scenarioArtistId_fkey" FOREIGN KEY ("scenarioArtistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Album" ADD CONSTRAINT "Album_drawArtistId_fkey" FOREIGN KEY ("drawArtistId") REFERENCES "Artist"("id") ON DELETE SET NULL ON UPDATE CASCADE;
