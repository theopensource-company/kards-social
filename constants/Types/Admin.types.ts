import { TEmail, TPersonFullname } from './Common.types';

export type TAdminUserID = `admin:${string}`;
export type TAdminUserDetails = {
    id: TAdminUserID;
    name: TPersonFullname; //It's not strict about what comes after it, but this way it must contain at least one space (first & lastname)
    email: TEmail;
    created: Date;
    updated: Date;
};
