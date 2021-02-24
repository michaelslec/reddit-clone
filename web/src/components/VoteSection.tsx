import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import { Box, Flex, IconButton } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { PostSnippetFragment, useVoteMutation } from "../generated/graphql";

type VoteSectionProps = {
  post: PostSnippetFragment;
};

export default function VoteSection({
  post,
}: VoteSectionProps): ReactElement | null {
  const [, voteFn] = useVoteMutation();
  return (
    <Box pr={3}>
      <Flex direction="column" align="center">
        <IconButton
          onClick={() =>
            voteFn({
              postId: post.id,
              value: 1,
            })
          }
          aria-label="Up vote"
          icon={<ArrowUpIcon />}
          variant="ghost"
        />
        {post.points}
        <IconButton
          onClick={() =>
            voteFn({
              postId: post.id,
              value: -1,
            })
          }
          aria-label="Down vote"
          icon={<ArrowDownIcon />}
          variant="ghost"
        />
      </Flex>
    </Box>
  );
}
