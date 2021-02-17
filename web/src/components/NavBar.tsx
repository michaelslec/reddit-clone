import { Box, Flex, Link } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import NextLink from "next/link";

export interface NavBarProps {}

export default function NavBar(props: NavBarProps): ReactElement | null {
  return (
    <Flex bg="tomato" p={4}>
      <Box ml={"auto"}>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </Box>
    </Flex>
  );
}
