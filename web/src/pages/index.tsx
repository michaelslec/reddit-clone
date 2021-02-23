import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { usePostsQuery } from "../generated/graphql";
import Layout from "../components/Layout";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

function Index() {
  const [variables, setVariables] = useState({
    limit: 10,
    cursor: undefined as undefined | number,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });

  if (!fetching && !data) return <div>Your query failed for some reason</div>;

  return (
    <Layout>
      <Flex justify="space-between">
        <Heading size="3xl">LiReddit</Heading>
        <Flex direction="column-reverse">
          <NextLink href="/create-post">
            <Link>create post</Link>
          </NextLink>
        </Flex>
      </Flex>
      <hr />
      {!data && fetching ? (
        <div>Loading ...</div>
      ) : (
        <Stack mt={6} spacing={6}>
          {data!.posts.posts.map((post) => (
            <Box
              key={post.id}
              p={5}
              shadow="md"
              borderWidth="1px"
              flex="1"
              borderRadius="md"
            >
              <Heading fontSize="4xl">{post.title}</Heading>
              <hr />
              <Text mt={6} noOfLines={6}>
                {post.text}
              </Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              setVariables({
                ...variables,
                cursor: parseInt(
                  data.posts.posts[data.posts.posts.length - 1].createdAt
                ),
              });
            }}
            isLoading={fetching}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
