import type { FC, PropsWithChildren } from "react";
import type { TabProps } from "react-aria-components";
import { SelectionIndicator, Tab as TabUI } from "react-aria-components";
import "./style.css";

export const Tab: FC<PropsWithChildren<TabProps>> = ({
  children,
  ...props
}) => {
  return (
    <TabUI {...props}>
      <span>{children}</span>
      {/* Individual underline preview on hover (optional subtle effect) */}
      <SelectionIndicator className="react-aria-SelectionIndicator" />
    </TabUI>
  );
};
