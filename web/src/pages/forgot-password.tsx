import { Button, useToast } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { ReactElement } from "react";
import InputField from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClients";

function ForgotPassword(): ReactElement | null {
  const [, sendForgotPassword] = useForgotPasswordMutation();
  const toast = useToast();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await sendForgotPassword({
            input: values.usernameOrEmail.includes("@")
              ? {
                  email: values.usernameOrEmail,
                  username: "",
                  password: "",
                }
              : {
                  email: "",
                  username: values.usernameOrEmail,
                  password: "",
                },
          });

          if (response.data?.forgotPassword.valueOf())
            toast({
              title: "Sent",
              status: "success",
              description:
                "If an account with that email or username exists, we sent you an email",
              duration: 3000,
            });
          else
            setErrors({
              usernameOrEmail: "Please enter a username or password",
            });
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="usernameOrEmail"
              label="Username or Email"
              placeholder="username"
            />
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
}

export default withUrqlClient(createUrqlClient)(ForgotPassword);
