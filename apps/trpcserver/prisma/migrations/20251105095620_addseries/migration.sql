-- CreateTable
CREATE TABLE "Serie" (
    "id" TEXT NOT NULL,
    "numbenamer" TEXT NOT NULL,
    "startYear" TEXT NOT NULL,
    "endYear" TEXT NOT NULL,

    CONSTRAINT "Serie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SerieAlbum" (
    "albumId" INTEGER NOT NULL,
    "serieId" TEXT NOT NULL,

    CONSTRAINT "SerieAlbum_pkey" PRIMARY KEY ("albumId","serieId")
);

-- CreateTable
CREATE TABLE "_SerieAlbum" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SerieAlbum_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "SerieAlbum_albumId_serieId_key" ON "SerieAlbum"("albumId", "serieId");

-- CreateIndex
CREATE INDEX "_SerieAlbum_B_index" ON "_SerieAlbum"("B");

-- AddForeignKey
ALTER TABLE "SerieAlbum" ADD CONSTRAINT "SerieAlbum_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SerieAlbum" ADD CONSTRAINT "SerieAlbum_serieId_fkey" FOREIGN KEY ("serieId") REFERENCES "Serie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SerieAlbum" ADD CONSTRAINT "_SerieAlbum_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SerieAlbum" ADD CONSTRAINT "_SerieAlbum_B_fkey" FOREIGN KEY ("B") REFERENCES "Serie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
