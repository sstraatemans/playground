"use client";

import { trpcClient } from "@/utils/trpcClient";
import { useState } from "react";
import Markdown from "react-markdown";

const Page = () => {
  const [data, setData] = useState<any>("[]");
  return (
    <div>
      <h4>test of cross origin</h4>
      <p>can we use different packages on a different domain?</p>

      <div>
        <h5>trpc</h5>
        <button
          onClick={async () => {
            const res = await trpcClient.albums.all.query();
            setData(res);
          }}
        >
          get all
        </button>
        <button
          onClick={async () => {
            const res = await trpcClient.characters.getCharacterById.query(1);
            setData(res);
          }}
        >
          get wiske
        </button>
        <hr />
        <h5>rest</h5>
        <button
          onClick={async () => {
            const res = await fetch(
              "https://rest.suskeenwiske.dev/v1/albums",
            ).then((res) => res.json());
            setData(res);
          }}
        >
          get all
        </button>

        <hr />
        <h5>graphql (apollo client)</h5>
        <button
          onClick={async () => {
            const res = await fetch(
              "https://rest.suskeenwiske.dev/v1/albums",
            ).then((res) => res.json());
            setData(res);
          }}
        >
          get all
        </button>
      </div>

      <hr />
      <hr />
      <h5>results</h5>

      {data.description && <Markdown>{data.description}</Markdown>}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default Page;
