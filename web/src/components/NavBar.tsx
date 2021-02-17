import { Box, Button, Flex, HStack, Link } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

export interface NavBarProps {}

export default function NavBar(): ReactElement | null {
  const [{ data, fetching }] = useMeQuery();

  let body = null;

  if (fetching) body = null;
  else if (!data?.me)
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link>register</Link>
        </NextLink>
      </>
    );
  else
    body = (
      <HStack>
        <Box>{data.me.username}</Box>
        <Button variant="link">logout</Button>
      </HStack>
    );

  return (
    <Flex bg="tan" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
}
