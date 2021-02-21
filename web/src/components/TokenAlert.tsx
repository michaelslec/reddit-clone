import {
  Alert,
  AlertIcon,
  Box,
  AlertTitle,
  AlertDescription,
  Link,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { ReactElement } from "react";

export interface TokenAlertProps {
  message: string;
}

export default function TokenAlert({
  message,
}: TokenAlertProps): ReactElement | null {
  return (
    <Alert status="error">
      <AlertIcon />
      <Box flex="1">
        <AlertTitle>An Error Occured</AlertTitle>
        <AlertDescription>
          {message + ". "}
          {message.includes("expired") ? (
            <NextLink href="/forgot-password" passHref>
              <Link href="/forgot-password" color="grey">
                Click Here
              </Link>
            </NextLink>
          ) : null}
        </AlertDescription>
      </Box>
    </Alert>
  );
}
