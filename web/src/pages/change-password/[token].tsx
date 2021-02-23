import { Button, useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../components/InputField";
import TokenAlert from "../../components/TokenAlert";
import { Wrapper } from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { createUrqlClient } from "../../utils/createUrqlClient";

function ChangePassword() {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const toast = useToast();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });

          const data = response.data?.changePassword;
          if (data?.__typename === "FieldError") {
            if (data.field === "token")
              toast({
                render: () => {
                  return <TokenAlert router={router} message={data.message} />;
                },
              });

            setErrors({
              [data.field]: data.message,
            });
          } else router.push("/");
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              label="New Password"
              placeholder="New Password"
              type="password"
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

export default withUrqlClient(createUrqlClient)(ChangePassword);
