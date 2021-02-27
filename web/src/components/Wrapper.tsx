import { Box } from "@chakra-ui/react";
import Head from "next/head";
import React, { ReactElement, ReactNode } from "react";

export interface WrapperProps {
  variant?: "small" | "regular";
  title: string;
  content?: string;
  children: ReactNode;
}

export function Wrapper({
  title,
  content,
  children,
  variant = "regular",
}: WrapperProps): ReactElement | null {
  return (
    <>
      <Head>
        <title>{title}</title>
        {content ? <meta name="description" content={content} /> : null}
      </Head>
      <Box
        mt={8}
        mx="auto"
        maxW={variant == "regular" ? "800px" : "400px"}
        w="100%"
      >
        {children}
      </Box>
    </>
  );
}
