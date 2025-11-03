'use client';

import Link from 'next/link';
import { trpc } from '@/providers/TRPCProvider';

const Page = () => {
  const { data } = trpc.albums.all.useQuery();

  return (
    <ul>
      {data?.map((album) => (
        <li key={album.number}>
          <Link href={`/albums/${album.id}`}>{album.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Page;
