"use client";

import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import classnames from "classnames";

type HeaderProps<T extends "h1" | "h2" | "h3" | "h4" | "h5" | "h6"> = {
  children?: ReactNode;
  variant?: T;
  className?: string;
} & ComponentPropsWithoutRef<T>;

const fontSize = {
  h1: "text-5xl md:text-6xl lg:text-7xl",
  h2: "text-4xl md:text-5xl lg:text-6xl",
  h3: "text-3xl md:text-4xl lg:text-5xl",
  h4: "text-2xl md:text-3xl lg:text-4xl",
  h5: "text-xl md:text-2xl lg:text-3xl",
  h6: "text-lg md:text-xl lg:text-2xl",
} as const;

const fontWeight = {
  h1: "font-extrabold",
  h2: "font-bold",
  h3: "font-bold",
  h4: "font-semibold",
  h5: "font-semibold",
  h6: "font-medium",
} as const;

export const Heading = <
  T extends "h1" | "h2" | "h3" | "h4" | "h5" | "h6" = "h1",
>({
  children,
  variant = "h2" as T,
  className,
  ...rest
}: HeaderProps<T>) => {
  const Tag = variant as ElementType;

  const classes = classnames(
    fontSize[variant],
    fontWeight[variant],
    "leading-tight tracking-tight",
    className,
  );

  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
};
