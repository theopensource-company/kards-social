export type TUnsecuredWebsite = `http://${string}`;
export type TSecureWebsite = `https://${string}`;
export type TWebsite = TUnsecuredWebsite | TSecureWebsite;

export type TEmail = `${string}@${string}.${string}`;
export type TPersonFullname = `${string} ${string}`;

export type TRecordID<Table extends string = string> = `${Table}:${string}`;
