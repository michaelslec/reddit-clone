import React, { ReactElement } from "react";
import NavBar from "./NavBar";
import { Wrapper, WrapperProps } from "./Wrapper";

export interface LayoutProps extends WrapperProps {
  children: React.ReactNode;
}

export default function Layout({
  children,
  variant,
}: LayoutProps): ReactElement | null {
  return (
    <>
      <NavBar />
      <Wrapper variant={variant}>{children}</Wrapper>
    </>
  );
}
