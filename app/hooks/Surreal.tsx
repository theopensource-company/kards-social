import { ReactNode, useEffect, useState } from 'react';
import { Result } from 'surrealdb.js';
import { SurrealInit, SurrealQuery, SurrealSignin, SurrealSignout } from '../lib/Surreal';

export function InitializeSurreal({children}: {children: ReactNode}) {
    const [ready, setReady] = useState<boolean>(false);
    useEffect(() => {
        (async () => {
            await SurrealInit();
            setReady(true);
        })();
    }, []);

    return (
        <>
            {ready && children}
        </>
    );
};

export function useSurrealQuery<T = unknown>(query: string, vars?: Record<string, unknown>): {
    isReady: boolean;
    result: Result<T[]>[] | null;
} {
    const [isReady, setReady] = useState<boolean>(false);
    const [result, setResult] = useState<Result<T[]>[] | null>(null);

    useEffect(() => {
        SurrealQuery<T>(query, vars).then(setResult).catch(console.error).finally(() => {
            setReady(true);
        });
    }, []);

    return {
        isReady,
        result
    };
};

export function useSurrealSignin(auth: {
    identifier: string;
    password: string;
}): {
    isReady: boolean;
    isAuthenticated: boolean | null;
} {
    const [isReady, setReady] = useState<boolean>(false);
    const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        SurrealSignin(auth).then(setAuthenticated).finally(() => {
            setReady(true);
        });
    }, []);

    return {
        isReady,
        isAuthenticated
    };
}

export function useSurrealSignout(): {
    isReady: boolean;
    isAuthenticated: boolean | null;
} {
    const [isReady, setReady] = useState<boolean>(false);
    const [isAuthenticated, setAuthenticated] = useState<boolean | null>(null);

    useEffect(() => {
        SurrealSignout().then(setAuthenticated).finally(() => {
            setReady(true);
        })
    }, []);

    return {
        isReady,
        isAuthenticated
    };
}