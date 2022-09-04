import * as React from "react";
import IconBase from "./IconBase";
import { ColoredSvgProps } from "../../constants/Types";

export default function Info({ color, size = 20 }: ColoredSvgProps) {
  return (
    <IconBase icon="Info" color={color} size={size}>
      <path
        d="M200 100c0 55.228-44.772 100-100 100S0 155.228 0 100 44.772 0 100 0s100 44.772 100 100Zm-185 0c0 46.944 38.056 85 85 85s85-38.056 85-85-38.056-85-85-85-85 38.056-85 85Z"
        transform={`scale(${size / 200})`}
      />
      <path
        d="M110 60c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10ZM90 94c0-5.523 4.477-10 10-10s10 4.477 10 10v60c0 5.523-4.477 10-10 10s-10-4.477-10-10V94Z"
        transform={`scale(${size / 200})`}
      />
    </IconBase>
  );
}
