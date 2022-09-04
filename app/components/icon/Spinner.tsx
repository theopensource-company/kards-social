import * as React from "react";
import { useMediaPredicate } from "react-media-hook";
import { ColorType, Color } from "../../constants/Colors";

type Props = {
  color?: ColorType;
  size?: number;
};

export default function Spinner({ color, size = 20 }: Props) {
  const isDarkMode = useMediaPredicate("(prefers-color-scheme: dark)");
  const chosenColor = Color[color ?? (isDarkMode ? "Dark" : "Light")];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="spinnerIcon"
    >
      <g>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="scale"
          values="1;0.85;1"
          dur="1.5s"
          repeatCount="indefinite"
        />

        <g>
          <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from={0}
            to={360}
            dur="3s"
            repeatCount="indefinite"
          />

          <circle r={25} cx={25} cy={100} fill={chosenColor} />
          <circle r={25} cx={175} cy={100} fill={chosenColor} />
          <circle r={25} cx={100} cy={25} fill={chosenColor} />
          <circle r={25} cx={100} cy={175} fill={chosenColor} />
        </g>
      </g>
    </svg>
  );
}
