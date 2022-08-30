import React, { MouseEventHandler, ReactNode, useState } from "react";
import Image from "next/image";

import styles from "../styles/Button.module.scss";
import { ColorType } from "../constants/Colors";
import { StaticImageData } from "next/image";

export type ButtonSize = "Small" | "Large";

type Props = {
  onClick: MouseEventHandler;
  color?: ColorType;
  size?: ButtonSize;
  text?: string;
  icon?: StaticImageData | React.ReactNode;
  iconAlt?: string;
  iconRound?: boolean;
  showSpinner?: boolean;
};

class InvalidButtonError extends Error {}

export default function Button({
  size = "Large",
  iconRound = false,
  color,
  onClick,
  text,
  icon,
  iconAlt,
  showSpinner = false
}: Props) {
  const [shownIcon, setShownIcon] = useState<ReactNode | StaticImageData | undefined>("");

  if (!text && !icon)
    throw new InvalidButtonError(
      "Neither a button text or icon have been provided."
    );

  if (icon) {
    setShownIcon(icon);
  }

  const classes = [
    styles.default,
    color ? styles[`color${color}`] : 0,
    styles[`${size.toLowerCase()}${text ? "Text" : ""}${icon ? "Icon" : ""}`],
  ]
    .filter((a) => !!a)
    .join(" ");

  return (
    <div className={classes} onClick={(event) => { onClick(event); }}>
      {icon && (
        <div
          className={[styles[`icon${size}`], iconRound ? styles.iconRound : 0]
            .filter((a) => !!a)
            .join(" ")}
        >
          {React.isValidElement(shownIcon) ? (
            shownIcon
          ) : (
            <Image
              src={shownIcon as StaticImageData}
              alt={iconAlt ?? text ?? "Button icon"}
            />
          )}
        </div>
      )}
      {text && <span>{text}</span>}
    </div>
  );
}

export const ButtonSmall = (config: Props) => {
  return Button({ ...config, size: "Small" });
};
export const ButtonLarge = (config: Props) => {
  return Button({ ...config, size: "Large" });
};
