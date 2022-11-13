import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import moment from 'moment';

import {
    useAuthState,
    useDelayedRefreshAuthenticatedUser,
} from '../../hooks/KardsUser';
import AccountLayout from '../../components/Layout/Account';
import { UpdateAuthenticatedUser } from '../../lib/KardsUser';

export default function Account() {
    const router = useRouter();
    const auth = useAuthState();
    const refreshAccount = useDelayedRefreshAuthenticatedUser();

    useEffect(() => {
        if (!auth.authenticated) {
            toast.info('Please signin first!');
            router.push('/auth/signin');
        }
    }, [auth, router]);

    return (
        <AccountLayout activeKey="profile">
            {auth.details && (
                <div>
                    <h1>{auth.details.name}</h1>
                    <p>@{auth.details.username}</p>
                    <p>{auth.details.email}</p>
                    <p>
                        Member since {moment(auth.details.created).toNow(true)}
                    </p>
                    <input
                        defaultValue={auth.details.name}
                        onBlur={async (e) => {
                            if (
                                await UpdateAuthenticatedUser({
                                    name: e.target
                                        .value as `${string} ${string}`,
                                })
                            ) {
                                refreshAccount();
                            } else {
                                toast.error('Failed to update user');
                            }
                        }}
                    />
                </div>
            )}
        </AccountLayout>
    );
}
