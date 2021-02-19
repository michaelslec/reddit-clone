import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClients";
import { withUrqlClient } from "next-urql";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
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
          else router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="username"
              placeholder="username"
            />
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

export default withUrqlClient(createUrqlClient)(Login);
