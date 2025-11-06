import { prisma, supabaseClient } from '../../db/client.js';

const addLeadingZero = (num: number, length = 3) => {
  return num.toString().padStart(length, '0');
};

const findAlbumImage = async (number: number): Promise<ArrayBuffer | null> => {
  try {
    const response = await fetch(
      `https://suskeenwiske.ophetwww.net/albums/pics/4kl/groot/${addLeadingZero(number)}.gif`
    );

    if (!response.ok) {
      throw new Error('Image not found');
    }

    const arrayBuffer = await response.arrayBuffer();
    return arrayBuffer;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    try {
      console.log(
        `Trying fallback image for albumId , number ${number} (${addLeadingZero(
          number
        )})`
      );
      const response = await fetch(
        `https://suskeenwiske.ophetwww.net/albums/pics/4kl/${addLeadingZero(number)}.gif`
      );

      const arrayBuffer = await response.arrayBuffer();
      return arrayBuffer;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
  }
};

export const downloadAlbumImages = async () => {
  // getting all the follow numbers for serie VK (vierkleuren)
  // the follow numbers corresponds with the image names on https://suskeenwiske.ophetwww.net/
  // and then we save the image with the albumID
  // we only try the numbers that don't have an image yet
  const albumIds = await prisma.serieAlbum.findMany({
    where: { serieId: 'VK' },
    orderBy: { number: 'asc' },
  });

  console.log(`Found ${albumIds.length} albums in VK series.`);
  for (const vkAlbum of albumIds) {
    //download

    // if it already has an image, skip
    if (vkAlbum.image) {
      continue;
    }

    const arrayBuffer = await findAlbumImage(vkAlbum.number);
    if (!arrayBuffer) continue;

    const fileName = `${vkAlbum.albumId}.gif`;
    const { error } = await supabaseClient.storage
      .from('albums')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/gif', // e.g., 'image/png' for PNG
        upsert: true, // Overwrite if file exists (optional)
      });

    if (error) {
      console.error('Upload error:', error);
      continue;
    }

    // Get the public URL for the uploaded file
    const { data: publicData } = supabaseClient.storage
      .from('albums')
      .getPublicUrl(fileName);

    console.log('Public URL:', publicData.publicUrl);

    //add image urls in DB
    await prisma.$transaction(async () => {
      await prisma.album.update({
        where: { id: vkAlbum.albumId },
        data: { image: publicData.publicUrl },
      });
      await prisma.serieAlbum.update({
        where: {
          albumId_serieId: { albumId: vkAlbum.albumId, serieId: 'VK' },
        },
        data: { image: publicData.publicUrl },
      });
    });

    console.log(
      `Downloaded and uploaded image for albumId ${vkAlbum.albumId}: ${publicData.publicUrl},`
    );
  }
};
