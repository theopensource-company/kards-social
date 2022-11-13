import React, { useEffect } from 'react';
import AccountLayout from '../../components/Layout/Account';

export default function Account() {
    return (
        <AccountLayout activeKey="privacy">
            <div>Privacy</div>
        </AccountLayout>
    );
}
