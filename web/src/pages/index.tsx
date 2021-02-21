import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClients";
import { usePostsQuery } from "../generated/graphql";
import Layout from "../components/Layout";
import NextLink from "next/link";
import { Link } from "@chakra-ui/react";

function Index() {
  const [{ data }] = usePostsQuery();

  return (
    <Layout>
      <NextLink href="/create-post">
        <Link>create post</Link>
      </NextLink>
      {!data ? (
        <div>Loading ...</div>
      ) : (
        data.posts.map((p) => <div key={p.id}>{p.title}</div>)
      )}
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
