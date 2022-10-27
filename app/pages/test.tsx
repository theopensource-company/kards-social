import React from 'react';
import LayoutContentMiddle from '../components/Layout/ContentMiddle';
import { useUserDetails } from '../hooks/KardsUser';
import { useSurrealSignin } from '../hooks/Surreal';

export default function Account() {
    useSurrealSignin({
        identifier: 'micha',
        password: 'Password1!',
    });

    const { isReady, result } = useUserDetails();

    return (
        <LayoutContentMiddle>
            {isReady && 'bla: ' + JSON.stringify(result)}
        </LayoutContentMiddle>
    );
}
