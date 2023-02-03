import React from 'react';
import Image from 'next/image';
import { ImageVariant, TImage } from '../../constants/Types';

export default function KardsImage({
    baseURL,
    variant,
    style,
    alt,
    ...rest
}: TImage) {
    return (
        <Image
            src={`${baseURL}/${(variant ?? 'Normal').toLowerCase()}`}
            width={ImageVariant[variant ?? 'Normal']}
            height={ImageVariant[variant ?? 'Normal']}
            style={{
                ...(style ?? {}),
                maxWidth: '100%',
                maxHeight: '100%',
            }}
            alt={alt}
            {...rest}
        />
    );
}
