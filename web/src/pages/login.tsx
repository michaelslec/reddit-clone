import React from "react";
import { Form, Formik } from "formik";
import InputField from "../components/InputField";
import { Box, Button, Flex, Link } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { Wrapper } from "../components/Wrapper";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small" title="Login" content="Login to messages app">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({
            options: values.usernameOrEmail.includes("@")
              ? {
                  email: values.usernameOrEmail,
                  username: "",
                  password: values.password,
                }
              : {
                  email: "",
                  username: values.usernameOrEmail,
                  password: values.password,
                },
          });
          const data = response.data?.login;
          if (data?.__typename === "FieldError")
            setErrors({
              usernameOrEmail: data.field === "username" ? data.message : "",
              password: data.field === "password" ? data.message : "",
            });
          else if (
            data?.__typename === "User" &&
            typeof router.query.next === "string"
          )
            router.push(router.query.next);
          else router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="Username or Email"
              placeholder="username"
            />
            <Box mt={4}>
              <InputField name="password" type="password" />
            </Box>
            <Flex direction="row-reverse">
              <Box mt={1}>
                <NextLink href="/forgot-password">
                  <Link>forgot password?</Link>
                </NextLink>
              </Box>
            </Flex>
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

export default withUrqlClient(createUrqlClient)(Login);
