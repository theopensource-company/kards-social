import { useMutation, useQuery } from '@tanstack/react-query';
import {
    TAuthenticateKardsUser,
    TKardsUser,
} from '../../constants/Types/KardsUser.types';
import { processKardsUserRecord } from '../../lib/ProcessDatabaseRecord';
import {
    SurrealDatabase,
    SurrealInstance,
    SurrealNamespace,
} from '../../lib/Surreal';

export const useSignin = () =>
    useMutation({
        mutationFn: async (auth: TAuthenticateKardsUser) => {
            const token = await SurrealInstance.signin({
                NS: SurrealNamespace,
                DB: SurrealDatabase,
                SC: 'user',
                ...auth,
            });

            if (token) localStorage.setItem('kusrsess', token);
            return !!token;
        },
    });

export const useSignout = () =>
    useMutation({
        mutationFn: async () => {
            localStorage.removeItem('kusrsess');
            await SurrealInstance.invalidate();
            return true;
        },
    });

export function useAuthenticatedKardsUser() {
    return useQuery({
        queryKey: ['authenticated-user'],
        queryFn: async (): Promise<TKardsUser | null> => {
            const result = await SurrealInstance.opiniatedQuery<TKardsUser>(
                `SELECT * FROM user WHERE id = $auth.id`
            );

            if (!result?.[0]?.result?.[0]) return null;
            return processKardsUserRecord(result[0].result[0]);
        },
    });
}
