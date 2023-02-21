import * as React from 'react';

import { ColoredSvgProps } from '../../constants/Types/Svg.types';
import IconBase from './IconBase';

export default function Cross({ color, size = 20 }: ColoredSvgProps) {
    return (
        <IconBase icon="Cross" color={color} size={size}>
            <path
                d="M2.931 17.071c-3.905-3.905-3.905-10.237 0-14.142 3.905-3.905 10.237-3.905 14.142 0l179.994 179.994c3.906 3.905 3.906 10.237 0 14.142-3.905 3.905-10.237 3.905-14.142 0L2.931 17.071Z"
                transform={`scale(${size / 200})`}
            />
            <path
                d="M182.925 2.929c3.905-3.905 10.237-3.905 14.142 0 3.906 3.905 3.906 10.237 0 14.142L17.073 197.065c-3.905 3.905-10.237 3.905-14.142 0-3.905-3.905-3.905-10.237 0-14.142L182.925 2.929Z"
                transform={`scale(${size / 200})`}
            />
        </IconBase>
    );
}
