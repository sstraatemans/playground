import Link from "next/link";
import type { FC } from "react";

interface IProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  variant?: "primary" | "secondary" | "transparent";
  external?: boolean;
  outline?: boolean;
  label?: string;
}

export const UILink: FC<IProps> = ({
  label,
  variant = "primary",
  external = false,
  outline = false,
  href,
  ...props
}) => {
  const Component = external ? "a" : Link;

  const styleClasses =
    "inline-block rounded px-4 py-2 text-center text-sm font-medium transition ";

  return (
    <Component
      href={href || "#"}
      target={external ? "_blank" : undefined}
      {...props}
      className={styleClasses}
    >
      {label}
    </Component>
  );
};
