"use client";

import { useMemo } from "react";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface SwaggerProps {
  spec: any;
}

export const Swagger = ({ spec }: SwaggerProps) => {
  // Reorder the paths in the spec by path length (shortest first)
  const sortedSpec = useMemo(() => {
    if (!spec.paths) return spec;

    const sortedPaths = Object.keys(spec.paths)
      .sort((a, b) => {
        return a.localeCompare(b);
      })
      .reduce((acc: any, key: string) => {
        acc[key] = spec.paths[key];
        return acc;
      }, {});

    return {
      ...spec,
      paths: sortedPaths,
    };
  }, [spec]);

  return <SwaggerUI spec={sortedSpec} />;
};
