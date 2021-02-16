import React from "react";
import { Form, Formik } from "formik";

interface registerProps {}

export const Register: React.FC<registerProps> = ({}) => {
  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      onSubmit={(values) => console.log(values)}
    >
      {() => {
        <Form>
          <div>hello</div>
        </Form>;
      }}
    </Formik>
  );
};

export default Register;
