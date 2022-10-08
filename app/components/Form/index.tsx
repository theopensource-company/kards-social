import React from "react";
import { TForm, TFormItem } from "../../constants/Types";
import { FormItem } from "./FormItem";

export function Form({
  inputs,
  children,
  onSubmit,

  id,
  className,
}: TForm) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          values: inputs.reduce((o, i) => ({ ...o, [i.name]: i.value() }), {}),
          faulty: [...inputs]
            .filter((i) => !i.isValid())
            .reduce((o, i) => ({ ...o, [i.name]: i }), {}),
          event: e,
        });
      }}
      className={className}
      id={id}
    >
      {children}
    </form>
  );
}
