import { Box, Button, Flex, Heading, HStack, Link } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { useRouter } from "next/router";

export interface NavBarProps {}

export default function NavBar(): ReactElement | null {
  const router = useRouter();
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
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
        <NextLink href="/create-post">
          <Button mr={4} as={Link} variant="outline">
            create post
          </Button>
        </NextLink>
        <Box>{data.me.username}</Box>
        <Button
          isLoading={logoutFetching}
          onClick={async () => await logout()}
          variant="link"
        >
          logout
        </Button>
      </HStack>
    );

  return (
    <Box zIndex={1} top={0} position="sticky" bg="tan" p={4}>
      <Flex align="flex-end" m="auto" maxW={800}>
        <NextLink href="/">
          <Link>
            <Heading>LiReddit</Heading>
          </Link>
        </NextLink>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Box>
  );
}
