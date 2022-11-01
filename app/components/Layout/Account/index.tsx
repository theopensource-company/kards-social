import React from 'react';
import AppLayout from '../App';
import { TPageLayout } from '../../../constants/Types';

export default function AccountLayout({ children, ...props }: TPageLayout) {
    return <AppLayout {...props}>{children}</AppLayout>;
}
