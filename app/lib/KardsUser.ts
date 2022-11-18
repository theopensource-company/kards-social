import { TKardsUserDetails, TUpdateKardsUser } from '../constants/Types';
import { SurrealQuery } from './Surreal';

export const UserDetails = async (): Promise<TKardsUserDetails | null> => {
    const result = await SurrealQuery<TKardsUserDetails>('SELECT * FROM user');
    const preParse =
        result && result[0].result ? result[0].result[0] : null ?? null;
    if (preParse) {
        preParse.created = new Date(preParse.created);
        preParse.updated = new Date(preParse.updated);
    }

    return preParse;
};

export const UpdateAuthenticatedUser = async (
    user: TUpdateKardsUser
): Promise<TKardsUserDetails | false> => {
    if (user.email) {
        alert('Cannot yet update email field');
        return false;
    }

    const result = await SurrealQuery<TKardsUserDetails>(`UPDATE user SET 
        ${Object.keys(user).map((prop) => {
            const val = JSON.stringify({ ...user }[prop]);
            switch (prop) {
                default:
                    return `${prop}=${val}`;
            }
        })}
        WHERE id = $auth.id`);

    const preParse =
        result && result[0].result ? result[0].result[0] : false ?? false;
    if (preParse) {
        preParse.created = new Date(preParse.created);
        preParse.updated = new Date(preParse.updated);
    }

    return preParse;
};

export const UpdateAuthenticatedUserPassword = async (arg: {
    oldpassword: string;
    newpassword: string;
}): Promise<{
    password_correct: boolean;
    replacement_valid: boolean;
}> => {
    const result = await SurrealQuery(
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
