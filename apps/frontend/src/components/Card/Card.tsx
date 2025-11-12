import type { FC, PropsWithChildren } from "react";
import { Heading } from "../Typography/Heading";
import Stack from "../layout/Stack";

interface IProps extends PropsWithChildren {
  title: string;
  className?: string;
}

export const Card: FC<IProps> = ({ children, title, className }) => {
  return (
    <Stack
      direction="col"
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 ${className}`}
    >
      <Heading variant="h6" className="mb-4">
        {title}
      </Heading>
      <Stack direction="col" className="flex-1" justify="between">
        {children}
      </Stack>
    </Stack>
  );
};
