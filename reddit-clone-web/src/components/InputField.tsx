import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useField } from "formik";
import React, { InputHTMLAttributes, ReactElement } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  placeholder?: string;
  label?: string;
};

export default function InputField({
  label,
  placeholder,
  size: _,
  ...props
}: InputFieldProps): ReactElement | null {
  const [field, { error }] = useField(props);

  const infer_placeholder = placeholder || props.name;
  const infer_label =
    label || props.name[0].toUpperCase() + props.name.slice(1);

  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{infer_label}</FormLabel>
      <Input
        {...field}
        {...props}
        id={field.name}
        placeholder={infer_placeholder}
      />
      {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
    </FormControl>
  );
}
