import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClients";
import { usePostsQuery } from "../generated/graphql";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { Box, Heading, Link, Stack, Text } from "@chakra-ui/react";
import React from "react";

function Index() {
  const [{ data }] = usePostsQuery({
    variables: {
      limit: 10,
    },
  });

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>create post</Link>
      </NextLink>
      {!data ? (
        <div>Loading ...</div>
      ) : (
        <Stack spacing={6}>
          {data.posts.map((post) => (
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
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
