/* KARDS USER */

export type TKardsUserID = `user:${string}`;
export type TKardsUser = 
    TCreateKardsUser |
    TUpdateKardsUser |
    TRegisteredKardsUser;

export type TUserSigninDetails = {
    identifier: string;
    password: string;
};

export type TCreateKardsUser = {
    name: string;
    email: string;
    username: string;
    password: string;
}

export type TUpdateKardsUser = {
    id: TKardsUserID;
    name?: string;
    email?: string;
    username?: string;
    password?: string;
}

export type TRegisteredKardsUser = {
    id: TKardsUserID;
    name: string;
    email: string;
    username: string;
    created: Date;
    updated: Date;
}

/* LOGGING */

export type TLogID = `log:${string}`;
export type TLogService = `${string}:${string}/${string}`;
export type TLogLevel = 
    "INFO" |
    "WARNING" |
    "ERROR";

export type TCreateLog = {
    service: TLogService;
    message: string;
    level: TLogLevel;
    details?: {
        data?: object;
    };
};

export type TLog = TCreateLog & {
    id: TLogID;
};

/* COOKIES */

export type TCookieSameSite =
    "Strict" |
    "Lax" |
    "None";

export type TSetCookie = {
    request: Request,
    env: {
        KARDS_ORIGIN?: string;
    };
    response: Response,
    name: string,
    value: string,

    Expires?: Date,
    MaxAge?: number,
    Domain?: string,
    Path?: string,
    Secure?: boolean,
    HttpOnly?: boolean,
    SameSite?: TCookieSameSite
}