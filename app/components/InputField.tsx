import React from "react";
import { v4 as uuidv4 } from "uuid";

import styles from "../styles/InputField.module.scss";
import { BasicColorType } from "../constants/Colors";

export type FieldSize = "Small" | "Large";
export type FieldType = "Email" | "Number" | "Password" | "Tel" | "Text";

type Props = {
  value: string;
  setValue: Function;
  placeholder?: string;
  name?: string;
  color?: BasicColorType;
  label?: string;
  type?: FieldType;
  size?: FieldSize;
  id?: string;
  className?: string;
};

export default function InputField({
  type = "Text",
  size = "Large",
  color,
  name,
  value,
  setValue,
  placeholder,
  label,
  id,
  className,
}: Props) {
  if (!id) id = uuidv4();
  if (!name) name = id;

  const classes = [
    styles.default,
    color ? styles[`color${color}`] : 0,
    styles[`size${size}`],
    className,
  ]
    .filter((a) => !!a)
    .join(" ");

  return (
    <>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        name={name}
        className={classes}
        type={type.toLowerCase()}
        id={id}
      />
    </>
  );
}
