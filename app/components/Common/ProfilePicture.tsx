import React from 'react';
import { useAuthenticatedUser } from '../../hooks/KardsUser';
import { User as UserIcon } from 'react-feather';
import Image from 'next/image';

export default function ProfilePicture() {
    const user = useAuthenticatedUser();

    return user?.picture ? (
        <Image src={user.picture} alt={`${user.username}'s profile picture`} />
    ) : (
        <UserIcon />
    );
}
