import type { FC, PropsWithChildren } from "react";
import { Typography } from "../Typography/Typography";

interface IProps extends PropsWithChildren {}

export const CardContent: FC<IProps> = ({ children }) => {
  return <Typography className="text-gray-500">{children}</Typography>;
};
