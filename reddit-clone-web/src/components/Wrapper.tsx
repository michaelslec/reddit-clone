import { Box } from "@chakra-ui/react";

interface WrapperProps {}

export const Wrapper: React.FC<WrapperProps> = ({ children }) => {
  return <Box>{children}</Box>;
};
