import type { ReactNode, HTMLAttributes } from "react";
import React from "react";
import { twMerge } from "tailwind-merge"; // Optional: for merging classNames, install if needed

// Define breakpoints
type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

// Responsive value type: string for default, or object with optional default and breakpoints
type ResponsiveValue<T = string> =
  | T
  | ({ default?: T } & Partial<Record<Breakpoint, T>>);

// Prop types for the Stack component
interface StackProps extends Omit<HTMLAttributes<HTMLDivElement>, "dir"> {
  children?: ReactNode;
  direction?: ResponsiveValue<"row" | "row-reverse" | "col" | "col-reverse">;
  justify?: ResponsiveValue<
    "start" | "end" | "center" | "between" | "around" | "evenly"
  >;
  align?: ResponsiveValue<"start" | "end" | "center" | "baseline" | "stretch">;
  gap?: ResponsiveValue<string>; // e.g., '4' or 'gap-4' (Tailwind class value)
  wrap?: ResponsiveValue<"wrap" | "nowrap" | "wrap-reverse">;
  className?: string;
}

// Helper function to generate responsive classes
const generateClasses = (
  prop: ResponsiveValue | undefined,
  prefix: string,
): string => {
  if (!prop) return "";
  if (typeof prop === "string") {
    return `${prefix}-${prop}`;
  }

  const classes: string[] = [];
  if ("default" in prop && prop.default) {
    classes.push(`${prefix}-${prop.default}`);
  }
  Object.entries(prop).forEach(([bp, value]) => {
    if (bp !== "default" && value) {
      classes.push(`${bp}:${prefix}-${value}`);
    }
  });
  return classes.join(" ");
};

const Stack: React.FC<StackProps> = ({
  children,
  direction = "col", // Default to column (vertical stack)
  justify,
  align,
  gap,
  wrap,
  className,
  ...rest
}) => {
  const baseClasses = "flex";
  const directionClasses = generateClasses(direction, "flex");
  const justifyClasses = generateClasses(justify, "justify");
  const alignClasses = generateClasses(align, "items");
  const gapClasses = generateClasses(gap, "gap");
  const wrapClasses = generateClasses(wrap, "flex");

  const mergedClasses = twMerge(
    baseClasses,
    directionClasses,
    justifyClasses,
    alignClasses,
    gapClasses,
    wrapClasses,
    className,
  );

  return (
    <div className={mergedClasses} {...rest}>
      {children}
    </div>
  );
};

export default Stack;
