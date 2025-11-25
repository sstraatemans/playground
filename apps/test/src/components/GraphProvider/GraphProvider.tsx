"use client";

import { UrqlProvider } from "@urql/next";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { graphClient, graphSSR } from "@/utils/graphClient";

export const GraphProvider = ({ children }: { children: ReactNode }) => {
  const [client, ssr] = useMemo(() => {
    return [graphClient, graphSSR];
  }, []);

  return (
    <UrqlProvider client={client} ssr={ssr}>
      {children}
    </UrqlProvider>
  );
};
