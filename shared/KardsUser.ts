import { TCreateKardsUser, TKardsUserID, TRegisteredKardsUser, TUserSigninDetails } from "./Types";
import { Surreal } from '@theopensource-company/surrealdb-cloudflare';
import jwt from '@tsndr/cloudflare-worker-jwt'
import { parse } from 'cookie';
import { Error, Success } from "./ApiResponse";
import { CreateSHA1Hash } from "./Hasher";
import Log from "./Log";

// Stolen names are additional names reserved by big contributors, as a reward for their work on our project!
// Stolen names cannot validate the rules of normal usernames, as important logic relies on that.
// Users with a Stolen name alongside their normal username cannot change their username or delete their account manually, as the code for this also needs to be updated. 
export const StolenNames = {
    // Micha de Vries, CEO of The Open Source Company
    'kearfy': 'micha',

    // Morgan Hofmann, Developer at The Open Source Company
    'leaf': 'morgan'
};

export async function Create(db: Surreal, user: TCreateKardsUser): Promise<Response> {
    const isNameInvalid = await ValidateUserPropertyName(user.name);
    if (isNameInvalid) return isNameInvalid;
    const isEmailValid = await ValidateUserPropertyEmail(user.email);
    if (isEmailValid) return isEmailValid;
    const isUsernameValid = await ValidateUserPropertyUsername(user.username);
    if (isUsernameValid) return isUsernameValid;
    const isPasswordValid = await ValidateUserPropertyPassword(user.password);
    if (isPasswordValid) return isPasswordValid;

    if (StolenNames[user.username]) return Error({
        status: 422,
        error: "username_already_taken",
        message: "The specified username is already associated to an account, please choose a different one."
    });

    const query = `
        let $name = ${JSON.stringify(user.name)};
        let $email = ${JSON.stringify(user.email.toLowerCase())};
        let $username = ${JSON.stringify(user.username.toLowerCase())};
        let $password = ${JSON.stringify(user.password)};

        CREATE user SET
            name = $name,
            email = $email,
            username = $username,
            password = crypto::argon2::generate($password)
    `;

    const result = (await db.query(query)).slice(-1)[0];
    if (result.status == "ERR") {
        if (result.detail.match(/^Database index `email` already contains `user:.*`$/i)) return Error({
            status: 422,
            error: "email_already_used",
            message: "The specified email address is already associated to an account, please signin instead."
        });
        
        if (result.detail.match(/^Database index `username` already contains `user:.*`$/i)) return Error({
            status: 422,
            error: "username_already_taken",
            message: "The specified username is already associated to an account, please choose a different one."
        });

        Log(db, {
            level: "ERROR",
            message: `Failed to create user, got response from database: "${result.detail}".`,
            service: 'api:user/create',
            details: {
                data: user
            }
        });

        return Error({
            status: 500,
            error: "unknown_error",
            message: "An unknown error has occured, your request can not be processed at this time."
        });
    }

    return Success({});
}

export async function Info(db: Surreal, match: string): Promise<TRegisteredKardsUser | undefined | false> {
    const type = TypeForIdentifier(match);
    if (type == "username" && StolenNames[match]) match = StolenNames[match];
    const query = `SELECT * FROM user WHERE ${type} = ${JSON.stringify(match)}`;
    const result = (await db.query(query)).slice(-1)[0];
    if (result.status == "ERR") {
        Log(db, {
            level: "ERROR",
            message: `Failed to obtain info about user, got response from database: "${result.detail}".`,
            service: 'api:user/info',
            details: {
                data: {
                    type,
                    match
                }
            }
        });

        return false;
    }

    const user = result.result[0];
    if (user) {
        delete user.password;
        user.created = new Date(user.created);
        user.updated = new Date(user.updated);
        console.log(user);
        
        return user as TRegisteredKardsUser;
    }
}

export async function IdFromToken(request: Request, env: {
    USER_JWT_SECRET: string;
}): Promise<TKardsUserID | false> {
    const cookie = parse(request.headers.get('Cookie') || '');
    if (!cookie.kusrsess) return false;
    const token = atob(cookie.kusrsess);
    if (!await jwt.verify(token, env.USER_JWT_SECRET ?? 'very-secret-local-testing-secret')) return false;
    const { payload: { id } } = jwt.decode(token);
    return id;
}

export async function VerifyCredentials(db: Surreal, user: TUserSigninDetails): Promise<Response | string> {
    const type = TypeForIdentifier(user.identifier);
    const query = `
        SELECT id FROM user WHERE ${type} = ${JSON.stringify(user.identifier)} AND crypto::argon2::compare(password, ${JSON.stringify(user.password)});
    `;

    const result = (await db.query(query)).slice(-1)[0];
    if (result.status == 'OK') {
        const id = result.result[0]?.id;
        if (id) {
            return id;
        } else {
            return Error({
                status: 401,
                error: "invalid_credentials",
                message: "The provided username/email or password is incorrect, please adjust them."
            });
        }
    } else {
        Log(db, {
            level: "ERROR",
            message: `Failed to verify user credentials, got response from database: "${result.detail}".`,
            service: 'api:user/signin',
            details: {
                data: user
            }
        });

        return Error({
            status: 500,
            error: "unknown_error",
            message: "An unknown error has occured, your request can not be processed at this time."
        });
    }
}

export function TypeForIdentifier(v: string): "id" | "email" | "username" {
    return v.includes('@') ? 'email' : v.includes(':') ? 'id' : 'username';
}

export async function ValidateUserPropertyName(v): Promise<Response | undefined> {
    if (!v.match(/^[A-ZÀ-ÖØ-öø-ÿ]+ [A-ZÀ-ÖØ-öø-ÿ][A-ZÀ-ÖØ-öø-ÿ ]*$/i)) return Error({
        status: 422,
        error: "invalid_name",
        message: "The specified name does not contain a first and last name, please provide your full name."
    });
}

export async function ValidateUserPropertyEmail(v): Promise<Response | undefined> {
    if (!v.match(/^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i)) return Error({
        status: 422,
        error: "invalid_email",
        message: "The specified email not valid, please provide one in the following format: \"user@email.domain\"."
    });
}

export async function ValidateUserPropertyUsername(v): Promise<Response | undefined> {
    if (!v.match(/^[a-z0-9](?:[a-z0-9._-]{1,18}[a-z0-9.])$/i)) return Error({
        status: 422,
        error: "invalid_username",
        message: "The specified email not valid, please provide one in the following format: \"user@email.domain\"."
    });
}

export async function ValidateUserPropertyPassword(v): Promise<Response | undefined> {
    if (!v.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,32}$/)) return Error({
        status: 422,
        error: "insecure_password",
        message: "The specified password not secure, please provide one that follows all password policies."
    });

    if (await HasPasswordBeenPowned(v)) return Error({
        status: 422,
        error: "breached_password",
        message: "The specified password has been breached before, please choose a different one."
    });
}

export async function HasPasswordBeenPowned(p): Promise<boolean> {
    const hashed = await CreateSHA1Hash(p);
    return !!(await (await fetch(new Request(`https://api.pwnedpasswords.com/range/${hashed.slice(0, 5)}`))).text()).split('\n').reduce((o: any, c: string) => ({
        ...o,
        [c.split(':')[0]]: c.split(':')[1]
    }), {})[hashed.slice(5).toUpperCase()];
}