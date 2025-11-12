import cn from "classnames";
import type { FC } from "react";

type TypographySize = "small" | "default" | "large";
type TypographyVariant = "body" | "code";

interface TypographyProps {
  children?: React.ReactNode;
  size?: TypographySize;
  variant?: TypographyVariant;
  bold?: boolean;
  className?: string;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "code";
}

const sizeMap: Record<TypographySize, string> = {
  small: "text-sm leading-5",
  default: "text-base leading-6",
  large: "text-lg leading-7",
};

const variantMap: Record<TypographyVariant, string> = {
  body: "font-sans tracking-normal",
  code: "font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded",
};

export const Typography: FC<TypographyProps> = ({
  children,
  size = "default",
  variant = "body",
  bold = false,
  className,
  as: Component = "p",
  ...props
}) => {
  return (
    <Component
      className={cn(
        sizeMap[size],
        variantMap[variant],
        bold && "font-bold",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
