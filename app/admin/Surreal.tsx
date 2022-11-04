import React, { ReactNode, useEffect, useState } from 'react';
import Surreal, { Result } from 'surrealdb.js';
import {
    SurrealEndpoint,
    SurrealNamespace,
    SurrealDatabase,
} from '../lib/Surreal';

export const SurrealInstanceAdmin = new Surreal(SurrealEndpoint);

export const SurrealInitAdmin = async () => {
    await SurrealInstanceAdmin.use(SurrealNamespace, SurrealDatabase);
    const token = localStorage.getItem('kadmsess');
    if (token) {
        console.log('Authenticating admin with existing token');
        try {
            await SurrealInstanceAdmin.authenticate(token);
        } catch (e) {
            console.error(
                'Failed to authenticate admin with existing token, clearing it.'
            );
            localStorage.removeItem('kadmsess');
        }
    }
};

export const SurrealQueryAdmin = async <T = unknown,>(
    query: string,
    vars?: Record<string, unknown>
): Promise<Result<T[]>[]> =>
    SurrealInstanceAdmin.query<Result<T[]>[]>(query, vars);

export function InitializeSurrealAdmin({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState<boolean>(false);
    useEffect(() => {
        (async () => {
            await SurrealInitAdmin();
            setReady(true);
        })();
    }, []);

    return <>{ready && children}</>;
}
