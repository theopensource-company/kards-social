import React from 'react';
import Layout from '..';
import { TPageLayout } from '../../../constants/Types';
import AppLayoutNavbar from './Navbar';

export default function AppLayout({ children, ...props }: TPageLayout) {
    return (
        <Layout {...props}>
            <AppLayoutNavbar />
            {children}
        </Layout>
    );
}
