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

// Class mappings - use complete class names for Tailwind to detect
const directionMap = {
  row: "flex-row",
  "row-reverse": "flex-row-reverse",
  col: "flex-col",
  "col-reverse": "flex-col-reverse",
} as const;

const justifyMap = {
  start: "justify-start",
  end: "justify-end",
  center: "justify-center",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

const alignMap = {
  start: "items-start",
  end: "items-end",
  center: "items-center",
  baseline: "items-baseline",
  stretch: "items-stretch",
} as const;

const wrapMap = {
  wrap: "flex-wrap",
  nowrap: "flex-nowrap",
  "wrap-reverse": "flex-wrap-reverse",
} as const;

/**
 * Safelist: All possible responsive classes that can be generated
 * This ensures Tailwind includes them in the build
 *
 * Direction classes with breakpoints:
 * sm:flex-row md:flex-row lg:flex-row xl:flex-row 2xl:flex-row
 * sm:flex-row-reverse md:flex-row-reverse lg:flex-row-reverse xl:flex-row-reverse 2xl:flex-row-reverse
 * sm:flex-col md:flex-col lg:flex-col xl:flex-col 2xl:flex-col
 * sm:flex-col-reverse md:flex-col-reverse lg:flex-col-reverse xl:flex-col-reverse 2xl:flex-col-reverse
 *
 * Justify classes with breakpoints:
 * sm:justify-start md:justify-start lg:justify-start xl:justify-start 2xl:justify-start
 * sm:justify-end md:justify-end lg:justify-end xl:justify-end 2xl:justify-end
 * sm:justify-center md:justify-center lg:justify-center xl:justify-center 2xl:justify-center
 * sm:justify-between md:justify-between lg:justify-between xl:justify-between 2xl:justify-between
 * sm:justify-around md:justify-around lg:justify-around xl:justify-around 2xl:justify-around
 * sm:justify-evenly md:justify-evenly lg:justify-evenly xl:justify-evenly 2xl:justify-evenly
 *
 * Align classes with breakpoints:
 * sm:items-start md:items-start lg:items-start xl:items-start 2xl:items-start
 * sm:items-end md:items-end lg:items-end xl:items-end 2xl:items-end
 * sm:items-center md:items-center lg:items-center xl:items-center 2xl:items-center
 * sm:items-baseline md:items-baseline lg:items-baseline xl:items-baseline 2xl:items-baseline
 * sm:items-stretch md:items-stretch lg:items-stretch xl:items-stretch 2xl:items-stretch
 *
 * Wrap classes with breakpoints:
 * sm:flex-wrap md:flex-wrap lg:flex-wrap xl:flex-wrap 2xl:flex-wrap
 * sm:flex-nowrap md:flex-nowrap lg:flex-nowrap xl:flex-nowrap 2xl:flex-nowrap
 * sm:flex-wrap-reverse md:flex-wrap-reverse lg:flex-wrap-reverse xl:flex-wrap-reverse 2xl:flex-wrap-reverse
 */

// Helper function to generate responsive classes using complete class names
const generateClasses = <T extends string>(
  prop: ResponsiveValue<T> | undefined,
  classMap: Record<T, string>,
): string => {
  if (!prop) return "";

  if (typeof prop === "string") {
    return classMap[prop] || "";
  }

  const classes: string[] = [];
  if ("default" in prop && prop.default) {
    classes.push(classMap[prop.default as T] || "");
  }
  Object.entries(prop).forEach(([bp, value]) => {
    if (bp !== "default" && value) {
      const className = classMap[value as T];
      if (className) {
        classes.push(`${bp}:${className}`);
      }
    }
  });
  return classes.join(" ");
};

// Helper for gap classes which can be any string
const generateGapClasses = (
  gap: ResponsiveValue<string> | undefined,
): string => {
  if (!gap) return "";

  if (typeof gap === "string") {
    // If it starts with 'gap-', use as is, otherwise add 'gap-' prefix
    return gap.startsWith("gap-") ? gap : `gap-${gap}`;
  }

  const classes: string[] = [];
  if ("default" in gap && gap.default) {
    const gapValue = gap.default.startsWith("gap-")
      ? gap.default
      : `gap-${gap.default}`;
    classes.push(gapValue);
  }
  Object.entries(gap).forEach(([bp, value]) => {
    if (bp !== "default" && value) {
      const gapValue = value.startsWith("gap-") ? value : `gap-${value}`;
      classes.push(`${bp}:${gapValue}`);
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
  const directionClasses = generateClasses(direction, directionMap);
  const justifyClasses = generateClasses(justify, justifyMap);
  const alignClasses = generateClasses(align, alignMap);
  const gapClasses = generateGapClasses(gap);
  const wrapClasses = generateClasses(wrap, wrapMap);

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
