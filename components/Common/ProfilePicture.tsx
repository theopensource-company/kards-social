import React from 'react';
import { User as UserIcon } from 'react-feather';

import { ImageVariant, TImage } from '../../constants/Types/Image.types';
import { useAuthenticatedKardsUser } from '../../hooks/Queries/Auth';
import KardsImage from './Image';

export default function ProfilePicture({
    alt,
    style,
    rounded,
    ...props
}: Omit<TImage, 'baseURL' | 'alt'> & {
    alt?: string;
    rounded?: boolean;
}) {
    const { data: user } = useAuthenticatedKardsUser();

    return user?.picture ? (
        <KardsImage
            baseURL={user.picture}
            alt={alt ?? `${user.username}'s profile picture`}
            style={{
                ...(style ?? {}),
                ...(rounded == false ? {} : { borderRadius: '50%' }),
            }}
            {...props}
        />
    ) : (
        <div
            style={{
                ...(style ?? {}),
                ...(rounded == false ? {} : { borderRadius: '50%' }),
                width: ImageVariant[props.variant ?? 'Normal'],
                height: ImageVariant[props.variant ?? 'Normal'],
                maxWidth: '100%',
                maxHeight: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <UserIcon
                size={1000}
                style={{
                    width: '60%',
                    height: '60%',
                }}
            />
        </div>
    );
}
