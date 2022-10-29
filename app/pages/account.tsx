import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import moment from 'moment';

import { useAuthState } from '../hooks/KardsUser';
import { SurrealQuery } from '../lib/Surreal';
import AppLayout from '../components/Layout/App';

export default function Account() {
    const router = useRouter();

    const auth = useAuthState();

    useEffect(() => {
        if (!auth.authenticated) {
            toast.info('Please signin first!');
            router.push('/auth/signin');
        }
    }, [auth, router]);

    return (
        <AppLayout>
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
                        onBlur={(e) => {
                            const query =
                                'UPDATE user SET name="' + e.target.value + '"';
                            console.log(query);

                            SurrealQuery(query, {
                                name: e.target.value,
                            });
                        }}
                    />
                </div>
            )}
        </AppLayout>
    );
}
