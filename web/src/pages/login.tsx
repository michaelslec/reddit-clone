import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useLoginMutation } from "../generated/graphql";
import { useRouter } from "next/router";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await login({ options: values });
          const data = response.data?.login;
          if (data?.__typename === "FieldError")
            setErrors({
              username: data.field === "username" ? data.message : "",
              password: data.field === "password" ? data.message : "",
            });
          else router.push("/");
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

export default Login;
