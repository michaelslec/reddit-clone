import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";
import {
  usePostsQuery,
  useDeletePostMutation,
  useMeQuery,
} from "../generated/graphql";
import Layout from "../components/Layout";
import NextLink from "next/link";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import VoteSection from "../components/VoteSection";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

function Index() {
  const [variables, setVariables] = useState({
    limit: 15,
    cursor: undefined as undefined | number,
  });
  const [{ data, fetching }] = usePostsQuery({ variables });
  const [, deletePost] = useDeletePostMutation();
  const [{ data: meData }] = useMeQuery();

  if (!fetching && !data) return <div>Your query failed for some reason</div>;

  return (
    <Layout>
      {!data && fetching ? (
        <div>Loading ...</div>
      ) : (
        <Stack mt={6} spacing={6}>
          {data!.posts.posts.map((post) =>
            !post ? null : (
              <Flex
                key={post.id}
                p={5}
                pl={1}
                shadow="md"
                borderWidth="1px"
                flex="1"
                borderRadius="md"
              >
                <VoteSection post={post} />
                <Box flexGrow={1}>
                  <NextLink href={`/post/${encodeURIComponent(post.id)}`}>
                    <Link>
                      <Heading fontSize="4xl">{post.title}</Heading>
                    </Link>
                  </NextLink>
                  <Text> posted by {post.creator.username}</Text>
                  <hr />
                  <Text mt={4} noOfLines={6}>
                    {post.text}
                  </Text>
                  <Flex
                    direction="column"
                    justify="space-between"
                    align="flex-end"
                  >
                    {post.creator.id === meData?.me?.id ? (
                      <Box mt={2}>
                        <NextLink href={`/post/edit/${post.id}`}>
                          <IconButton
                            icon={<EditIcon />}
                            aria-label="Delete post"
                            variant="ghost"
                          />
                        </NextLink>
                        <IconButton
                          onClick={() => deletePost({ id: post.id })}
                          icon={<DeleteIcon />}
                          aria-label="Delete post"
                          colorScheme="red"
                          variant="ghost"
                        />
                      </Box>
                    ) : null}
                  </Flex>
                </Box>
              </Flex>
            )
          )}
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
