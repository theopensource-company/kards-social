import dynamic from 'next/dynamic';
import React from 'react';
import { InitializeSurrealAdmin } from '../admin/Surreal';
const App = dynamic(() => import('../admin/App'), { ssr: false });

const Page = () => {
    return (
        <InitializeSurrealAdmin>
            <App />
        </InitializeSurrealAdmin>
    );
};

Page.hideNavbar = true;

export default Page;
