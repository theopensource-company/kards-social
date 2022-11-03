import React, { ReactNode, useEffect, useState } from 'react';
import { Result } from 'surrealdb.js';
import { SurrealInit, SurrealQuery } from '../lib/Surreal';

export function InitializeSurreal({ children }: { children: ReactNode }) {
    const [ready, setReady] = useState<boolean>(false);
    useEffect(() => {
        (async () => {
            await SurrealInit();
            setReady(true);
        })();
    }, []);

    return <>{ready && children}</>;
}

export function useSurrealQuery<T = unknown>(
    query: string,
    vars?: Record<string, unknown>
): {
    isReady: boolean;
    result: Result<T[]>[] | null;
} {
    const [isReady, setReady] = useState<boolean>(false);
    const [result, setResult] = useState<Result<T[]>[] | null>(null);

    useEffect(() => {
        SurrealQuery<T>(query, vars)
            .then(setResult)
            .catch(console.error)
            .finally(() => {
                setReady(true);
            });
    }, [query, vars]);

    return {
        isReady,
        result,
    };
}
