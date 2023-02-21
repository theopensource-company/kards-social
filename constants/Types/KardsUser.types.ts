import { TEmail, TPersonFullname, TRecordID } from './Common.types';
import { TImageBaseURL } from './Image.types';

export type TKardsUserID = TRecordID<'user'>;
export type TKardsUser = {
    id: TKardsUserID;
    name: TPersonFullname; //It's not strict about what comes after it, but this way it must contain at least one space (first & lastname)
    email: TEmail;
    username: string;
    picture?: TImageBaseURL;
    created: Date;
    updated: Date;
};

export type TUpdateKardsUser = Partial<
    Pick<TKardsUser, 'email' | 'username' | 'name'>
>;

export type TAuthenticateKardsUser = {
    identifier: TKardsUser['email'] | TKardsUser['username'];
    password: string;
};

export type TAuthState<T = TKardsUser> = {
    authenticated: boolean;
    details: T | null;
};
