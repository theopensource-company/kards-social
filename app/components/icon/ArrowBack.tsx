import * as React from "react";
import { Color } from "../../constants/Colors";
import { ColoredSvgProps } from "../../constants/Types";

export default function ArrowBack({ color, size = 20 }: ColoredSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="svg-ArrowBack-styles"
    >
      <style type="text/css">
        {color
          ? `.svg-ArrowBack-styles g path { stroke: ${Color[color]}; }`
          : `
          .svg-ArrowBack-styles g path { stroke: ${Color.Light}; }
        @media (prefers-color-scheme: dark) {
          .svg-ArrowBack-styles g path { stroke: ${Color.Dark}; }
        }
      `}
      </style>
      <g clipPath="url(#a)">
        <path
          d="M6.455 99.995h187.09M6.4 99.971l75.724-75.724M6.43 100l75.724 75.724"
          strokeWidth={12.91}
          strokeLinecap="round"
          transform={`scale(${size / 200})`}
        />
      </g>
    </svg>
  );
}
