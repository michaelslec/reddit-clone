import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { ReactElement } from "react";
import InputField from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

export interface CreatePostProps {}

export default function CreatePost(): ReactElement | null {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ title: "", text: "" }}
        onSubmit={async (values, { setErrors }) => {
          console.log(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" />
            <Box mt={4}>
              <InputField name="text" label="Body" placeholder="text..." />
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
    </Wrapper>
  );
}
