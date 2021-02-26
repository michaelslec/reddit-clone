import { usePostQuery } from "../generated/graphql";
import useGetIntId from "./useGetIntId";

export default function useGetPostFromUrl() {
  const intId = useGetIntId();
  return usePostQuery({
    pause: intId === -1,
    variables: {
      id: intId,
    },
  });
}
