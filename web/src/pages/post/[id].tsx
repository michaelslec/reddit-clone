import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { createUrqlClient } from "../../utils/createUrqlClient";

type PostProps = {};

function Post(props: PostProps): ReactElement | null {
  const router = useRouter();
  return <div>Post</div>;
}

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
