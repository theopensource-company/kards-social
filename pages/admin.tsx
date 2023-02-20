import dynamic from 'next/dynamic';
import React from 'react';
import { InitializeSurrealAdmin } from '../admin/Surreal';
const App = dynamic(() => import('../admin/App'), { ssr: false });

const AdminPage = () => {
    return (
        <InitializeSurrealAdmin>
            <App />
        </InitializeSurrealAdmin>
    );
};

AdminPage.hideNavbar = true;

export default AdminPage;
