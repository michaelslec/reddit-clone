import { useRouter } from "next/router";
import { usePostQuery } from "../generated/graphql";

const router = useRouter();

export default function useGetPostFromUrl() {
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const query = usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });

  return { id: intId, ...query };
}
