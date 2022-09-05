import React from "react";
import { Color } from "../../constants/Colors";
import { ColoredSvgProps } from "../../constants/Types";

export default function ArrowBack({
  children,
  icon,
  color,
  size = 20,
  styles = "",
}: ColoredSvgProps & {
  styles?: string;
  children: React.ReactNode;
  icon: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`svg-${icon}-styles`}
    >
      <style type="text/css">
        {color
          ? `.svg-${icon}-styles * { ${styles} fill-box; stroke: ${Color[color]}; fill: ${Color[color]}; color: ${Color[color]}; }`
          : `
          .svg-${icon}-styles * { ${styles} stroke: ${Color.Light}; fill: ${Color.Light}; color: ${Color.Light}; }
        @media (prefers-color-scheme: dark) {
          .svg-${icon}-styles * { ${styles} stroke: ${Color.Dark}; fill: ${Color.Dark}; color: ${Color.Dark}; }
        }
      `}
      </style>
      {children}
    </svg>
  );
}
