import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { ReactElement } from "react";
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
  return <Layout>{data?.post?.text}</Layout>;
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
