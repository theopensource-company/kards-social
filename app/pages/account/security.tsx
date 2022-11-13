import React, { useEffect } from 'react';
import AccountLayout from '../../components/Layout/Account';

export default function Account() {
    return (
        <AccountLayout activeKey="security">
            <div>Security</div>
        </AccountLayout>
    );
}
