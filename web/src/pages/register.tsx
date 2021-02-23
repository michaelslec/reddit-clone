import React from "react";
import { Form, Formik } from "formik";
import { Wrapper } from "../components/Wrapper";
import InputField from "../components/InputField";
import { Box, Button } from "@chakra-ui/react";
import { useRegisterMutation } from "../generated/graphql";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { withUrqlClient } from "next-urql";

interface registerProps {}

const Register: React.FC<registerProps> = ({}) => {
  const router = useRouter();
  const [, register] = useRegisterMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", username: "", password: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await register({ options: values });
          const data = response.data?.register;
          if (data?.__typename === "FieldError")
            setErrors({
              [data.field]: data.message,
            });
          else router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="email" />
            <Box mt={4}>
              <InputField name="username" />
            </Box>
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

export default withUrqlClient(createUrqlClient)(Register);
