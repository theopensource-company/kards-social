import React from 'react';
import dynamic from 'next/dynamic';
import { InitializeSurrealAdmin } from '../admin/Surreal';
const App = dynamic(() => import('../admin/App'), { ssr: false });

const AdminPage = () => {
    return (
        <InitializeSurrealAdmin>
            <App />
        </InitializeSurrealAdmin>
    );
};

export default AdminPage;
