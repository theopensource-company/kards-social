import * as React from 'react';
import IconBase from './IconBase';
import { ColoredSvgProps } from '../../constants/Types';

export default function Spinner({ color, size = 20 }: ColoredSvgProps) {
    return (
        <IconBase
            icon="Spinner"
            color={color}
            size={size}
            styles="transform-origin: center; transform-box: fill-box;"
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

                    <circle
                        r={(15 / 200) * size}
                        cx={(30 / 200) * size}
                        cy={(100 / 200) * size}
                    />
                    <circle
                        r={(15 / 200) * size}
                        cx={(170 / 200) * size}
                        cy={(100 / 200) * size}
                    />

                    <circle
                        r={(15 / 200) * size}
                        cx={(100 / 200) * size}
                        cy={(30 / 200) * size}
                    />
                    <circle
                        r={(15 / 200) * size}
                        cx={(100 / 200) * size}
                        cy={(170 / 200) * size}
                    />
                    {/*<circle r={25} cx={175} cy={100} />
          <circle r={25} cx={100} cy={25} />
          <circle r={25} cx={100} cy={175} />*/}
                </g>
            </g>
        </IconBase>
    );
}
