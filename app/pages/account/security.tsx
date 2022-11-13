import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

import { useAuthState } from '../../hooks/KardsUser';
import AccountLayout from '../../components/Layout/Account';

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
        <AccountLayout activeKey="security">
            {auth.details && <div>Security</div>}
        </AccountLayout>
    );
}
