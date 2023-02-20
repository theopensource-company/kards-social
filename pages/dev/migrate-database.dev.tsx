import React from 'react';
import { migrateDatabase } from '../../cli/_migratetool.mjs';
import DevLayout from './_layout';

export async function getStaticProps() {
    if (process.env.NODE_ENV == 'production')
        return {
            props: {
                notFound: true,
            },
        };

    await migrateDatabase(
        {
            SURREAL_HOST: 'http://127.0.0.1:12001',
            SURREAL_NAMESPACE: 'kards-deployment_local',
            SURREAL_DATABASE: 'kards-social',
            SURREAL_USERNAME: 'root',
            SURREAL_PASSWORD: 'root',
            KARDS_DEFAULT_ADMIN: JSON.stringify({
                name: 'Default admin',
                email: 'admin@kards.local',
                password: 'Password1!',
            }),
        },
        false,
        true,
        process.cwd()
    );

    return {
        props: {},
    };
}

export default function Page() {
    return (
        <DevLayout>
            <h1>Finished, check console for success state</h1>
        </DevLayout>
    );
}
