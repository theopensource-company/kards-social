import React from "react";
import { TForm } from "../../constants/Types";

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
