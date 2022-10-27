import React from 'react';
import { SvgBaseProps } from '../constants/Types';
import { Color } from '../constants/Colors';

const LogoStyle = `.svg-Logo-styles .fillLight { fill: ${Color.Light} !important} .svg-Logo-styles .fillDark { fill: ${Color.Dark} !important}`;
export function Logo({ size = 200 }: SvgBaseProps) {
    return (
        <svg
            width={size}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className="svg-Logo-styles"
        >
            <style>{LogoStyle}</style>
            <g clipPath="url(#a)">
                <rect
                    x={1.75}
                    y={1.225}
                    width={150.633}
                    height={144.721}
                    rx={14.892}
                    transform="matrix(.986 -.16678 .18078 .98352 -2.841 47.026)"
                    className="fillDark"
                    stroke="#F7F3E3"
                    strokeWidth={3}
                />
                <rect
                    x={1.68}
                    y={1.312}
                    width={150.728}
                    height={144.623}
                    rx={14.892}
                    transform="matrix(.99314 -.11695 .12698 .9919 15.968 32.186)"
                    className="fillLight"
                    stroke="#F98C10"
                    strokeWidth={3}
                />
                <rect
                    x={1.606}
                    y={1.396}
                    width={150.789}
                    height={144.559}
                    rx={14.892}
                    transform="matrix(.99776 -.06692 .07272 .99735 36.878 18.402)"
                    className="fillLight"
                    stroke="#0C1618"
                    strokeWidth={3}
                />
                <path
                    d="M79.387 103.167 66.504 90.544l.85 13.329-3.816.224-1.863-29.215 3.815-.224.864 13.539L77.566 73.95l4.821-.283-12.316 15.406 14.305 13.802-4.99.292Zm7.087-12.027c-.15-2.347.195-4.43 1.033-6.245.836-1.844 2.048-3.304 3.634-4.379 1.615-1.076 3.443-1.674 5.483-1.794 2.013-.118 3.787.213 5.324.992 1.537.78 2.71 1.805 3.521 3.075l-.267-4.191 3.857-.227 1.465 22.97-3.858.226-.272-4.275c-.669 1.385-1.73 2.57-3.183 3.552-1.426.953-3.131 1.488-5.116 1.604-2.04.12-3.917-.275-5.63-1.184-1.714-.909-3.103-2.244-4.17-4.004-1.066-1.761-1.673-3.801-1.82-6.12Zm19.457-1.1c-.11-1.732-.556-3.22-1.336-4.465-.781-1.244-1.794-2.166-3.039-2.767-1.218-.63-2.54-.902-3.966-.819-1.425.084-2.704.495-3.835 1.235-1.131.74-2.005 1.772-2.622 3.099-.617 1.326-.87 2.856-.76 4.588.113 1.76.56 3.277 1.343 4.55.78 1.244 1.78 2.18 2.999 2.81 1.216.602 2.537.861 3.963.778 1.426-.084 2.704-.496 3.835-1.235 1.158-.77 2.045-1.817 2.662-3.143.615-1.355.867-2.898.756-4.63Zm13.629-8.54c.587-1.353 1.473-2.429 2.656-3.227 1.212-.8 2.712-1.253 4.501-1.358l.251 3.94-1.006.059c-4.277.25-6.267 2.695-5.972 7.334l.797 12.491-3.815.224-1.465-22.97 3.815-.224.238 3.73Zm10.889 7.06c-.149-2.347.195-4.429 1.033-6.245.836-1.844 2.048-3.303 3.635-4.378 1.614-1.077 3.456-1.676 5.524-1.797a10.311 10.311 0 0 1 5.07.965c1.589.72 2.832 1.727 3.728 3.02l-.775-12.155 3.857-.226 1.978 31.017-3.857.226-.276-4.317c-.667 1.414-1.713 2.611-3.137 3.592-1.427.953-3.132 1.488-5.117 1.604-2.04.12-3.931-.274-5.672-1.181-1.714-.91-3.103-2.245-4.169-4.005-1.067-1.76-1.674-3.8-1.822-6.12Zm19.458-1.1c-.111-1.732-.557-3.22-1.337-4.464-.781-1.245-1.794-2.167-3.038-2.767-1.219-.63-2.541-.903-3.967-.82-1.425.084-2.704.496-3.835 1.235-1.131.74-2.005 1.773-2.622 3.1-.617 1.326-.87 2.855-.759 4.587.112 1.76.559 3.277 1.342 4.55.781 1.244 1.78 2.181 2.999 2.81 1.217.602 2.538.861 3.963.778 1.426-.084 2.704-.495 3.835-1.235 1.158-.769 2.045-1.817 2.662-3.143.615-1.354.867-2.898.757-4.63Zm19.198 10.823c-1.761.103-3.359-.097-4.794-.602-1.437-.533-2.595-1.307-3.473-2.32-.88-1.043-1.406-2.26-1.579-3.653l3.941-.23c.185 1.138.775 2.043 1.772 2.714 1.025.67 2.32.958 3.885.866 1.454-.085 2.579-.474 3.377-1.166.797-.692 1.165-1.527 1.102-2.505-.064-1.005-.558-1.72-1.483-2.142-.926-.45-2.341-.859-4.244-1.224-1.734-.347-3.16-.712-4.279-1.095a8.038 8.038 0 0 1-2.898-1.892c-.813-.878-1.267-2.057-1.362-3.538a5.414 5.414 0 0 1 .843-3.289c.636-1.019 1.579-1.846 2.829-2.48 1.249-.662 2.698-1.042 4.347-1.138 2.543-.15 4.639.373 6.286 1.566 1.647 1.194 2.598 2.905 2.853 5.134l-3.816.224c-.16-1.197-.711-2.132-1.652-2.806-.913-.676-2.11-.97-3.591-.883-1.37.08-2.441.437-3.214 1.072-.774.634-1.13 1.426-1.069 2.376.048.755.325 1.37.833 1.845.533.445 1.173.8 1.919 1.065.773.235 1.828.496 3.165.782 1.677.35 3.047.719 4.11 1.105a6.734 6.734 0 0 1 2.765 1.773c.81.822 1.273 1.931 1.39 3.326.08 1.258-.197 2.41-.832 3.457-.634 1.047-1.576 1.902-2.824 2.564-1.222.633-2.658.997-4.307 1.094Z"
                    className="fillDark"
                />
            </g>
        </svg>
    );
}

export function LogoSmall({ size = 200 }: SvgBaseProps) {
    return (
        <svg
            width={size}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 200"
            className="svg-Logo-styles"
        >
            <g clipPath="url(#a)">
                <rect
                    x={1.75}
                    y={1.225}
                    width={150.633}
                    height={144.721}
                    rx={14.892}
                    transform="matrix(.986 -.16678 .18078 .98352 -4.197 47.026)"
                    className="fillDark"
                    stroke="#F7F3E3"
                    strokeWidth={3}
                />
                <rect
                    x={1.68}
                    y={1.312}
                    width={150.728}
                    height={144.623}
                    rx={14.892}
                    transform="matrix(.99314 -.11695 .12698 .9919 14.613 32.186)"
                    className="fillLight"
                    stroke="#F98C10"
                    strokeWidth={3}
                />
                <rect
                    x={1.606}
                    y={1.396}
                    width={150.789}
                    height={144.559}
                    rx={14.892}
                    transform="matrix(.99776 -.06692 .07272 .99735 35.523 18.402)"
                    className="fillLight"
                    stroke="#0C1618"
                    strokeWidth={3}
                />
                <path
                    d="M139.043 127.636 102.234 91.57l2.428 38.083-10.9.639-5.324-83.47 10.901-.64 2.467 38.682 32.034-40.705 13.776-.809-35.189 44.016 40.872 39.434-14.256.836Z"
                    className="fillDark"
                />
            </g>
        </svg>
    );
}

export default Logo;
