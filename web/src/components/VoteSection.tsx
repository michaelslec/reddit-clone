import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { useVoteMutation } from "../generated/graphql";

export interface VoteSectionProps {
  points: number;
  id: number;
}

export default function VoteSection({
  points,
  id,
}: VoteSectionProps): ReactElement | null {
  const [, voteFn] = useVoteMutation();
  return (
    <Box pr={3}>
      <Flex direction="column" align="center">
        <IconButton
          onClick={() =>
            voteFn({
              postId: id,
              value: 1,
            })
          }
          aria-label="Up vote"
          icon={<ArrowUpIcon />}
          variant="unstyled"
        />
        {points}
        <IconButton
          onClick={() =>
            voteFn({
              postId: id,
              value: -1,
            })
          }
          aria-label="Down vote"
          icon={<ArrowDownIcon />}
          variant="unstyled"
        />
      </Flex>
    </Box>
  );
}
