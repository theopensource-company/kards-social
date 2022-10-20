import { TCreateAdminUser, TAdminUserID, TRegisteredAdminUser, TAdminSigninDetails } from "./Types";
import { Surreal } from '@theopensource-company/surrealdb-cloudflare';
import jwt from '@tsndr/cloudflare-worker-jwt'
import { parse } from 'cookie';
import { Error, Success } from "./ApiResponse";
import { CreateSHA1Hash } from "./Hasher";
import Log from "./Log";

export async function Create(db: Surreal, user: TCreateAdminUser): Promise<Response> {
    const isNameInvalid = await ValidateAdminUserPropertyName(user.name);
    if (isNameInvalid) return isNameInvalid;
    const isEmailValid = await ValidateAdminUserPropertyEmail(user.email);
    if (isEmailValid) return isEmailValid;
    const isPasswordValid = await ValidateAdminUserPropertyPassword(user.password);
    if (isPasswordValid) return isPasswordValid;

    const query = `
        let $name = ${JSON.stringify(user.name)};
        let $email = ${JSON.stringify(user.email.toLowerCase())};
        let $password = ${JSON.stringify(user.password)};

        CREATE admin SET
            name = $name,
            email = $email,
            password = crypto::argon2::generate($password)
    `;

    const result = (await db.query(query)).slice(-1)[0];
    if (result.status == "ERR") {
        if (result.detail.match(/^Database index `email` already contains `user:.*`$/i)) return Error({
            status: 422,
            error: "email_already_used",
            message: "The specified email address is already associated to an account, please signin instead."
        });

        Log(db, {
            level: "ERROR",
            message: `Failed to create user, got response from database: "${result.detail}".`,
            service: 'api:admin/create',
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

export async function Info(db: Surreal, match: string): Promise<TRegisteredAdminUser | undefined | false> {
    const type = TypeForIdentifier(match);
    const query = `SELECT * FROM admin WHERE ${type} = ${JSON.stringify(match)}`;
    const result = (await db.query(query)).slice(-1)[0];
    if (result.status == "ERR") {
        Log(db, {
            level: "ERROR",
            message: `Failed to obtain info about user, got response from database: "${result.detail}".`,
            service: 'api:admin/info',
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
        return user;
    }
}

export async function List(db: Surreal): Promise<Array<TRegisteredAdminUser> | false> {
    const query = `SELECT * FROM admin`;    
    const result = (await db.query<Array<TRegisteredAdminUser & {
        password: string;
        created: Date | string;
        updated: Date | string;
    }>>(query)).slice(-1)[0];
    
    if (result.status == "ERR") {
        Log(db, {
            level: "ERROR",
            message: `Failed to obtain info about user, got response from database: "${result.detail}".`,
            service: 'api:admin/info'
        });

        return false;
    }

    const users = result.result?.map(user => {
        delete user.password;
        user.created = new Date(user.created);
        user.updated = new Date(user.updated);
        return user;
    });

    return users;
}

export async function IdFromToken(request: Request, env: {
    ADMIN_JWT_SECRET: string;
}): Promise<TAdminUserID | false> {
    const cookie = parse(request.headers.get('Cookie') || '');
    if (!cookie.kadmsess) return false;
    const token = atob(cookie.kadmsess);
    if (!await jwt.verify(token, env.ADMIN_JWT_SECRET ?? 'very-secret-local-testing-secret')) return false;
    const { payload: { id } } = jwt.decode(token);
    return id;
}

export async function VerifyCredentials(db: Surreal, user: TAdminSigninDetails): Promise<Response | string> {
    const type = TypeForIdentifier(user.identifier);
    const query = `
        SELECT id FROM admin WHERE ${type} = ${JSON.stringify(user.identifier)} AND crypto::argon2::compare(password, ${JSON.stringify(user.password)});
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

export async function CreateAccessToken(db: Surreal, identifier: TAdminUserID, env: {
    ADMIN_ACCESS_JWT_SECRET: string;
}): Promise<string | void> {
    const user = await Info(db, identifier);
    if (user) return btoa(await jwt.sign({ id: user.id }, env.ADMIN_ACCESS_JWT_SECRET ?? 'very-secret-local-testing-secret'));
    Log(db, {
        level: "WARNING",
        message: `Tried to create access token for unknown admin.`,
        service: 'api:admin/token',
        details: {
            data: {
                identifier
            }
        }
    });
}

export async function IdFromHeaders(request: Request, env: {
    ADMIN_ACCESS_JWT_SECRET: string;
}): Promise<string | false | void> {
    const token = (request.headers.get('Authorization') || "").split(' ').slice(-1)[0];
    if (token.length > 0) {
        if (!await jwt.verify(atob(token), env.ADMIN_ACCESS_JWT_SECRET ?? 'very-secret-local-testing-secret')) return false;
        const { payload: { id } } = jwt.decode(atob(token));
        return id;
    }
}

export function TypeForIdentifier(v: string): "id" | "email" {
    return v.includes('@') ? 'email' : 'id';
}

export async function ValidateAdminUserPropertyName(v): Promise<Response | undefined> {
    if (!v.match(/^[A-ZÀ-ÖØ-öø-ÿ]+ [A-ZÀ-ÖØ-öø-ÿ][A-ZÀ-ÖØ-öø-ÿ ]*$/i)) return Error({
        status: 422,
        error: "invalid_name",
        message: "The specified name does not contain a first and last name, please provide your full name."
    });
}

export async function ValidateAdminUserPropertyEmail(v): Promise<Response | undefined> {
    if (!v.match(/^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i)) return Error({
        status: 422,
        error: "invalid_email",
        message: "The specified email not valid, please provide one in the following format: \"user@email.domain\"."
    });
}

export async function ValidateAdminUserPropertyPassword(v): Promise<Response | undefined> {
    if (!v.match(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{16,32}$/)) return Error({
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