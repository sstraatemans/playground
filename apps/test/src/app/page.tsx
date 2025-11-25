"use client";

import { trpcClient } from "@/utils/trpcClient";
import { useState } from "react";

const Page = () => {
  const [data, setData] = useState<any>("[]");
  return (
    <div>
      <h4>test of cross origin</h4>
      <p>can we use different packages on a different domain?</p>

      <div className="flex content-between">
        <h5>trpc</h5>
        <button
          onClick={async () => {
            const res = await trpcClient.albums.all.query();
            setData(res);
          }}
        >
          get all
        </button>
      </div>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Page;
