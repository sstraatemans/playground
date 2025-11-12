import type { FC, PropsWithChildren } from "react";

interface IProps extends PropsWithChildren {}

export const CardFooter: FC<IProps> = ({ children }) => {
  return <div className="mt-4 flex justify-end gap-2">{children}</div>;
};
