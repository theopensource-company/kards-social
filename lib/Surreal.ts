import AwaitedSurreal from '@theopensource-company/awaited-surrealdb';

export const SurrealEndpoint = `${
    process.env.NEXT_PUBLIC_SURREAL_ENDPOINT ?? 'http://localhost:12001'
}/rpc`;
export const SurrealNamespace =
    process.env.NEXT_PUBLIC_SURREAL_NAMESPACE ?? 'kards-deployment_local';
export const SurrealDatabase =
    process.env.NEXT_PUBLIC_SURREAL_DATABASE ?? 'kards-social';

export const SurrealInstance = new AwaitedSurreal({
    endpoint: SurrealEndpoint,
    namespace: SurrealNamespace,
    database: SurrealDatabase,
});

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
