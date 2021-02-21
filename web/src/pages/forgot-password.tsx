import { Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import React, { ReactElement } from "react";
import InputField from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { createUrqlClient } from "../utils/createUrqlClients";

function ForgotPassword(): ReactElement | null {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ usernameOrEmail: "", password: "" }}
        // onSubmit={async (values, { setErrors }) => {}}
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
