import {
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  Link,
  useToast,
} from "@chakra-ui/react";
import { NextRouter } from "next/router";
import { ReactElement } from "react";

export interface TokenAlertProps {
  message: string;
  router: NextRouter;
}

export default function TokenAlert({
  message,
  router,
}: TokenAlertProps): ReactElement | null {
  const toast = useToast();
  const handleLink = () => {
    router.push("/forgot-password");
    toast.closeAll();
  };

  return (
    <Alert status="error">
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>An Error Occured</AlertTitle>
        <AlertDescription>
          {message + ". "}
          {message.includes("expired") ? (
            <Link onClick={handleLink} color="grey">
              Click Here
            </Link>
          ) : null}
        </AlertDescription>
      </Box>
    </Alert>
  );
}
