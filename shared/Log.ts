import { TCreateLog } from "./Types";
import { Surreal } from '../node_modules/@theopensource-company/surrealdb-cloudflare/dist/index';

export const LogSecretizeKeys = [
    "password"
];

export default async function Log(db: Surreal, content: TCreateLog) {
    if (!content.details) content.details = {};
    const secretize = content.details?.data ? [...LogSecretizeKeys].map(a => content.details.data[a]).filter(a => !!a) : [];
    const parsed = secretize.map(a => JSON.stringify(a).slice(1, -1)).reduce((a: any, s) => a.replaceAll(s, 'SECRET'), JSON.stringify(content));

    console.log('Creating log entry with the following content: \n', content);
    (await db.query(`CREATE log CONTENT ${parsed}`));
}