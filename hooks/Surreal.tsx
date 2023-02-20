import { useEffect, useState } from 'react';
import { Result } from 'surrealdb.js';
import { SurrealInstance } from '../lib/Surreal';

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
        SurrealInstance.opiniatedQuery<T>(query, vars)
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
