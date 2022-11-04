import Surreal, { Result } from 'surrealdb.js';

export const SurrealEndpoint = `${
    process.env.NEXT_PUBLIC_SURREAL_ENDPOINT ?? 'https://euc1-1-db.kards.social'
}/rpc`;
export const SurrealNamespace =
    process.env.NEXT_PUBLIC_SURREAL_NAMESPACE ?? 'theopensource-company';
export const SurrealDatabase =
    process.env.NEXT_PUBLIC_SURREAL_DATABASE ?? 'kards-social';
export const SurrealInstance = new Surreal(SurrealEndpoint);

export const SurrealInit = async () => {
    await SurrealInstance.use(SurrealNamespace, SurrealDatabase);
    const token = localStorage.getItem('kusrsess');
    if (token) {
        console.log('Authenticating user with existing token');
        try {
            await SurrealInstance.authenticate(token);
        } catch (e) {
            console.error(
                'Failed to authenticate user with existing token, clearing it.'
            );
            localStorage.removeItem('kusrsess');
        }
    }
};

export const SurrealQuery = async <T = unknown>(
    query: string,
    vars?: Record<string, unknown>
): Promise<Result<T[]>[]> => SurrealInstance.query<Result<T[]>[]>(query, vars);

export const SurrealSignin = async (auth: {
    identifier: string;
    password: string;
}): Promise<boolean> =>
    new Promise((resolve) => {
        SurrealInstance.signin({
            NS: SurrealNamespace,
            DB: SurrealDatabase,
            SC: 'user',
            ...auth,
        })
            .then((res) => {
                localStorage.setItem('kusrsess', res);
                resolve(true);
            })
            .catch((error) => {
                console.error(error);
                resolve(false);
            });
    });

export const SurrealSignout = async (): Promise<boolean> =>
    new Promise((resolve) => {
        SurrealInstance.invalidate()
            .then(async () => {
                localStorage.removeItem('kusrsess');
                resolve(false);
            })
            .catch((error) => {
                console.error(error);
                resolve(true);
            });
    });
