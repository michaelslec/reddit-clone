import { Box, Heading, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import Layout from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

function Post(): ReactElement | null {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const [{ data, fetching }] = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

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
