import { Box, Button, Flex, HStack, Link } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import isServer from "../utils/isServer";

export interface NavBarProps {}

export default function NavBar(): ReactElement | null {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });

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
        <Button
          isLoading={logoutFetching}
          onClick={() => logout()}
          variant="link"
        >
          logout
        </Button>
      </HStack>
    );

  return (
    <Flex zIndex={1} position="sticky" top={0} bg="tan" p={4}>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
}
