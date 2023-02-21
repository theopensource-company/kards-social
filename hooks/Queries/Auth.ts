import { useMutation, useQuery } from '@tanstack/react-query';
import {
    MissingAuthenticationError,
    UnsupportedActionError,
} from '../../constants/Errors';
import {
    TAuthenticateKardsUser,
    TKardsUser,
    TUpdateKardsUser,
} from '../../constants/Types/KardsUser.types';
import { processKardsUserRecord } from '../../lib/ProcessDatabaseRecord';
import {
    SurrealDatabase,
    SurrealInstance,
    SurrealNamespace,
} from '../../lib/Surreal';

export const useSignin = () =>
    useMutation({
        mutationKey: ['auth', 'mutate', 'signin'],
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
        mutationKey: ['auth', 'mutate', 'signout'],
        mutationFn: async () => {
            localStorage.removeItem('kusrsess');
            await SurrealInstance.invalidate();
            return true;
        },
    });

export function useAuthenticatedKardsUser() {
    return useQuery({
        queryKey: ['auth', 'query', 'user'],
        queryFn: async (): Promise<TKardsUser> => {
            const result = await SurrealInstance.opiniatedQuery<TKardsUser>(
                `SELECT * FROM user WHERE id = $auth.id`
            );

            if (!result?.[0]?.result?.[0])
                throw new MissingAuthenticationError();
            return processKardsUserRecord(result[0].result[0]);
        },
    });
}

export const useUpdateAuthenticatedKardsUser = () =>
    useMutation({
        mutationKey: ['auth', 'mutate', 'user'],
        mutationFn: async (user: TUpdateKardsUser): Promise<TKardsUser> => {
            if (user.email) {
                throw new UnsupportedActionError(
                    'It is not yet possible to change your email'
                );
            }

            const result =
                await SurrealInstance.opiniatedQuery<TKardsUser>(`UPDATE user SET 
                ${Object.keys(user).map((prop) => {
                    const val = JSON.stringify({ ...user }[prop]);
                    switch (prop) {
                        default:
                            return `${prop}=${val}`;
                    }
                })}
                WHERE id = $auth.id`);

            if (!result?.[0]?.result?.[0])
                throw new MissingAuthenticationError();
            return processKardsUserRecord(result[0].result[0]);
        },
    });
