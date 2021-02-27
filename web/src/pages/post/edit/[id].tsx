import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import InputField from "../../../components/InputField";
import Layout from "../../../components/Layout";
import {
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { createUrqlClient } from "../../../utils/createUrqlClient";
import useGetIntId from "../../../utils/useGetIntId";

function EditPost(): ReactElement | null {
  const router = useRouter();
  const intId = useGetIntId();
  const [{ data, fetching }] = usePostQuery({
    variables: {
      id: intId,
    },
  });
  const [, updatePost] = useUpdatePostMutation();

  if (fetching)
    return (
      <Layout title="Loading...">
        <div>Loading...</div>
      </Layout>
    );

  if (!data?.post) {
    return (
      <Layout title="Could not find post">
        <Box>Could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout variant="small" title={`Edit: ${data.post.title}`}>
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values) => {
          await updatePost({ id: intId, ...values });
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
              Update Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient)(EditPost);
