import React from "react";
import { TFormInput } from "../../constants/Types";
import styles from "../../styles/components/form/InputField.module.scss";
import { FormItem } from "./FormItem";

export class FormInputField extends FormItem<TFormInput> {
  constructor(config: TFormInput) {
    if (!config.invalidClass) config.invalidClass = styles.invalid;
    if (!config.type) config.type = "Text";
    super(config);
  }

  getValue() {
    return this.ref.current?.value ?? this.ref.current?.innerText ?? "";
  }

  renderer() {
    const classes = [
      styles.default,
      this.config.color ? styles[`color${this.config.color}`] : 0,
      styles[`size${this.config.size}`],
      this.config.className,
    ]
      .filter((a) => !!a)
      .join(" ");

    return (
      <input
        defaultValue={this.config.default}
        ref={this.ref}
        placeholder={this.config.placeholder}
        name={this.config.name}
        className={classes}
        type={this.config.type!.toLowerCase()}
        id={this.config.id}
      />
    );
  }
}
