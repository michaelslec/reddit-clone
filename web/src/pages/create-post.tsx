import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import { useCreatePostMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClients";

export interface CreatePostProps {}

function CreatePost(): ReactElement | null {
  const [, createPost] = useCreatePostMutation();
  const router = useRouter();

  return (
    <Layout variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values) => {
          await createPost({ input: values });
          router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" />
            <Box mt={4}>
              <InputField
                textArea
                name="text"
                label="Body"
                placeholder="text..."
              />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
            >
              Create Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient)(CreatePost);
