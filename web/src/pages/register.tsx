import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useMutation } from "urql";

interface registerProps {}

const kREGISTER_MUTATION = `mutation Register($username: String!, $password: String!) {
    register(options: {username: $username, password: $password}) {
      ... on User {
        id
        username
        createdAt
      }

      ... on FieldError {
        field
        message
      }
    }
  }`;

const Register: React.FC<registerProps> = ({}) => {
  const [, register] = useMutation(kREGISTER_MUTATION);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={(values) => {
          return register(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" />
            <Box mt={4}>
              <InputField name="password" type="password" />
            </Box>
            <Button
              mt={4}
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
            >
              register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
