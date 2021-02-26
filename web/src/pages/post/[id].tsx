import { Box, Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { ReactElement } from "react";
import Layout from "../../components/Layout";
import { createUrqlClient } from "../../utils/createUrqlClient";
import useGetPostFromUrl from "../../utils/useGetPostFromUrl";

function Post(): ReactElement | null {
  const [{ data, fetching }] = useGetPostFromUrl();
  if (fetching) return <Layout>Loading...</Layout>;

  if (!data?.post)
    return (
      <Layout>
        <Box>Could not find post with this ID</Box>
      </Layout>
    );

  return (
    <Layout>
      <Heading>{data.post.title}</Heading>
      <hr />
      <Text mt={4}>{data.post.text}</Text>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
