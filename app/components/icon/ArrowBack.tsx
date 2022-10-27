import * as React from 'react';
import IconBase from './IconBase';
import { ColoredSvgProps } from '../../constants/Types';

export default function ArrowBack({ color, size = 20 }: ColoredSvgProps) {
    return (
        <IconBase icon="ArrowBack" color={color} size={size}>
            <g clipPath="url(#a)">
                <path
                    d="M6.455 99.995h187.09M6.4 99.971l75.724-75.724M6.43 100l75.724 75.724"
                    strokeWidth={12.91}
                    strokeLinecap="round"
                    transform={`scale(${size / 200})`}
                />
            </g>
        </IconBase>
    );
}
