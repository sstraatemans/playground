'use client';

import { use } from 'react';
import { useParams } from 'next/navigation';
import { trpc } from '@/providers/TRPCProvider';

interface PageProps {
  params: {
    id: number;
  };
}

const Page = () => {
  const params = useParams();
  const id = params.id;

  const { data } = trpc.albums.getAlbumById.useQuery(Number(id));

  return (
    <div>
      <div>{data?.number}</div>
      {data?.title}
    </div>
  );
};

export default Page;
