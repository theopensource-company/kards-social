import React from "react";
import styles from "../styles/Container.module.scss";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className }: Props) {
  return (
    <div
      className={[styles.container, className ? className : 0]
        .filter((a) => !!a)
        .join(" ")}
    >
      {children}
    </div>
  );
}
