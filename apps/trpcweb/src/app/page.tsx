'use client';

import { trpc } from '@/providers/TRPCProvider';

const Page = () => {
  const { data } = trpc.albums.all.useQuery();

  return (
    <ul>
      {data?.map((album) => (
        <li key={album.number}>{album.title}</li>
      ))}
    </ul>
  );
};

export default Page;
