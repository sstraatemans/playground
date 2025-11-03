-- CreateTable
CREATE TABLE "Album" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumCharacter" (
    "albumId" INTEGER NOT NULL,
    "characterId" INTEGER NOT NULL,

    CONSTRAINT "AlbumCharacter_pkey" PRIMARY KEY ("albumId","characterId")
);

-- CreateTable
CREATE TABLE "_AlbumCharacter" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_AlbumCharacter_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlbumCharacter_albumId_characterId_key" ON "AlbumCharacter"("albumId", "characterId");

-- CreateIndex
CREATE INDEX "_AlbumCharacter_B_index" ON "_AlbumCharacter"("B");

-- AddForeignKey
ALTER TABLE "AlbumCharacter" ADD CONSTRAINT "AlbumCharacter_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumCharacter" ADD CONSTRAINT "AlbumCharacter_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumCharacter" ADD CONSTRAINT "_AlbumCharacter_A_fkey" FOREIGN KEY ("A") REFERENCES "Album"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AlbumCharacter" ADD CONSTRAINT "_AlbumCharacter_B_fkey" FOREIGN KEY ("B") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
