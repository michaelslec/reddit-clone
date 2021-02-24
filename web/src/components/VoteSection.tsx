import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import React, { ReactElement } from "react";

export interface VoteSectionProps {
  points: number;
}

export default function VoteSection({
  points,
}: VoteSectionProps): ReactElement | null {
  return (
    <Box pr={3}>
      <Flex direction="column" align="center">
        <IconButton
          aria-label="Up vote"
          icon={<ArrowUpIcon />}
          variant="unstyled"
        />
        {points}
        <IconButton
          aria-label="Down vote"
          icon={<ArrowDownIcon />}
          variant="unstyled"
        />
      </Flex>
    </Box>
  );
}
