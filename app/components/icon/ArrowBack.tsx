import * as React from "react";
import { useMediaPredicate } from "react-media-hook";
import { ColorType, Color } from "../../constants/Colors";

type Props = {
  color?: ColorType;
  size?: number;
};

export default function ArrowBack({ color, size = 20 }: Props) {
  const isDarkMode = useMediaPredicate("(prefers-color-scheme: dark)");
  const chosenColor = Color[color ?? (isDarkMode ? "Dark" : "Light")];
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#a)">
        <path
          d="M6.455 99.995h187.09M6.4 99.971l75.724-75.724M6.43 100l75.724 75.724"
          stroke={chosenColor}
          strokeWidth={12.91}
          strokeLinecap="round"
          transform={`scale(${size / 200})`}
        />
      </g>
    </svg>
  );
}
