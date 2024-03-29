import axios from 'axios';
import { Result } from 'surrealdb.js';
import {
    SurrealDatabase,
    SurrealEndpoint,
    SurrealInstance,
    SurrealNamespace,
} from './Surreal';

export const UpdateAuthenticatedUserPassword = async (arg: {
    oldpassword: string;
    newpassword: string;
}): Promise<{
    password_correct: boolean;
    replacement_valid: boolean;
}> => {
    const result = await SurrealInstance.opiniatedQuery(
        `
        SELECT * FROM user WHERE id = $auth.id AND crypto::argon2::compare(password, $oldpassword);
        UPDATE user SET password = crypto::argon2::generate($newpassword) WHERE id = $auth.id;
        SELECT * FROM user WHERE id = $auth.id AND crypto::argon2::compare(password, $newpassword);
    `,
        arg
    );

    return {
        password_correct: !!result[0].result && result[0].result.length > 0,
        replacement_valid: !!result[2].result && result[2].result.length > 0,
    };
};

export const UpdateUnauthenticatedUserPassword = async (arg: {
    email: string;
    secret: string;
    newpassword: string;
}): Promise<
    | void
    | {
          credentials_correct: false;
      }
    | {
          credentials_correct: true;
          replacement_valid: boolean;
      }
> => {
    const token = await new Promise<string | null>((resolve) => {
        axios
            .post(
                `${SurrealEndpoint.slice(0, -4)}/signin`,
                {
                    NS: SurrealNamespace,
                    DB: SurrealDatabase,
                    SC: 'verify_reset_password',
                    email: arg.email,
                    secret: arg.secret,
                },
                {
                    headers: {
                        Accept: 'application/json',
                    },
                }
            )
            .then((res) => resolve(res.data.token ?? null))
            .catch(() => resolve(null));
    });

    if (!token)
        return {
            credentials_correct: false,
        };

    const result = await new Promise<null | Result<unknown[]>[]>((resolve) => {
        axios
            .post(
                `${SurrealEndpoint.slice(0, -4)}/sql`,
                `
                    LET $newpassword = "${arg.newpassword.replace('"', '\\"')}";
                    UPDATE user SET password = crypto::argon2::generate($newpassword);
                    SELECT * FROM user WHERE crypto::argon2::compare(password, $newpassword);
                `,
                {
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'text/plain',
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => resolve(res.data ?? null))
            .catch(() => resolve(null));
    });

    if (!result) return;

    return {
        credentials_correct: true,
        replacement_valid: !!result[2].result && result[2].result.length > 0,
    };
};
