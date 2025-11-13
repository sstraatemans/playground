"use client";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

interface SwaggerProps {
  url?: string;
}

export const Swagger = ({ url }: SwaggerProps) => {
  // If URL is provided, let SwaggerUI fetch it directly
  return <SwaggerUI url={url} />;
};
