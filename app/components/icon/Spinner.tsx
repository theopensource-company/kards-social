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
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#a)" transform-origin="center">
        <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            from="0"
            to="360"
            dur="10s"
            repeatCount="indefinite"
        />

        <path 
            d="M200 100C200 80.2219 194.135 60.8879 183.147 44.443C172.159 27.9981 156.541 15.1808 138.268 7.61205C119.996 0.0432834 99.8891 -1.93705 80.491 1.92147C61.0929 5.77999 43.2746 15.3041 29.2893 29.2893C15.3041 43.2746 5.77999 61.0929 1.92147 80.491C-1.93705 99.8891 0.0432836 119.996 7.61205 138.268C15.1808 156.541 27.9981 172.159 44.443 183.147C60.8879 194.135 80.2219 200 100 200L100 187C82.793 187 65.9725 181.898 51.6654 172.338C37.3583 162.778 26.2073 149.191 19.6225 133.293C13.0377 117.396 11.3148 99.9035 14.6717 83.0271C18.0286 66.1508 26.3145 50.6489 38.4817 38.4817C50.6489 26.3145 66.1508 18.0286 83.0271 14.6717C99.9035 11.3148 117.396 13.0377 133.293 19.6225C149.191 26.2073 162.778 37.3583 172.338 51.6654C181.898 65.9725 187 82.793 187 100H200Z"
            fill="black" stroke="black" strokeWidth="25.82" strokeMiterlimit="2" strokeLinecap="round" strokeLinejoin="round" mask="url(#path-1-inside-1_143_85)"/>
      </g>
    </svg>
  );
}
