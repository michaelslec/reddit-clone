import { useRouter } from "next/router";

export default function useGetIntId() {
  const router = useRouter();

  return typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
}
