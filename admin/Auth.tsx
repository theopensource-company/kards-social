import { UserIdentity } from 'ra-core';
import { TAdminUserDetails } from '../constants/Types';
import { SurrealDatabase, SurrealNamespace } from '../lib/Surreal';
import { SurrealInstanceAdmin, SurrealQueryAdmin } from './Surreal';

export const AdminUserDetails = async (): Promise<TAdminUserDetails | null> => {
    const result = await SurrealQueryAdmin<TAdminUserDetails>(
        'SELECT * FROM admin WHERE id = $auth.id'
    );
    const preParse =
        result && result[0].result ? result[0].result[0] : null ?? null;
    if (preParse) {
        preParse.created = new Date(preParse.created);
        preParse.updated = new Date(preParse.updated);
    }

    return preParse;
};

const authProvider = {
    login: ({ username, password }: { username: string; password: string }) => {
        return SurrealInstanceAdmin.signin({
            NS: SurrealNamespace,
            DB: SurrealDatabase,
            SC: 'admin',
            identifier: username,
            password,
        })
            .then((res) => {
                localStorage.setItem('kadmsess', res);
                return Promise.resolve();
            })
            .catch((error) => {
                throw new Error(error);
            });
    },
    checkError: () => {
        // Required for the authentication to work
        return Promise.resolve();
    },
    checkAuth: () => {
        return AdminUserDetails().then((res) =>
            res ? Promise.resolve() : Promise.reject()
        );
    },
    getPermissions: () => {
        // Required for the authentication to work
        return Promise.resolve();
    },
    logout: async () => {
        console.log('logout');

        localStorage.removeItem('kadmsess');
        AdminUserDetails().then((res) => {
            //TODO: Temporary fix for session not being invalidated
            if (res) location.reload();
        });
    },
    getIdentity: () => {
        return AdminUserDetails().then((res) => {
            if (!res) return Promise.reject('Not authenticated');
            return Promise.resolve({
                id: res.id,
                fullname: res.name,
            } as UserIdentity);
        });
    },
};

export default authProvider;
