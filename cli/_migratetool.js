import { Surreal } from '@theopensource-company/surrealdb-cloudflare';
import fetch from 'node-fetch';
import fs from 'fs';
import * as url from 'url';
import path from 'path';

export const migrateDatabase = async (env, exit = true, log = true, __root = '') => {
    if (log) if (log) console.log("\nHost: " + env.SURREAL_HOST);
    if (log) if (log) console.log("NS: " + env.SURREAL_NAMESPACE);
    if (log) console.log("DB: " + env.SURREAL_DATABASE);

    try {
        if (__root == '') __root = path.dirname(path.dirname(import.meta.url));
    } catch(e) {}
    const dbfiles = fs.readdirSync(__root + '/tables');
    const emailtemplates = fs.readdirSync(__root + '/email_templates');

    const db = new Surreal({
      host: env.SURREAL_HOST,
      username: env.SURREAL_USERNAME,
      password: env.SURREAL_PASSWORD,
      namespace: env.SURREAL_NAMESPACE,
      database: env.SURREAL_DATABASE
    }, fetch);
  
    if (log) console.log('\nStarting database migrations\n');
  
    for(var i = 0; i < dbfiles.length; i++) {
      const f = dbfiles[i];
  
      try {
        if (log) console.log(' - Importing file ' + f);
        const q = fs.readFileSync(__root + '/tables/' + f).toString();
        if (log) console.log(' + Executing');
        await db.query(q);
      } catch(e) {
        if (log) console.log(' ! An error occured while processing file: ' + f);
        if (log) console.log(e);
      }
    }
  
    if (log) console.log('\nMigrating email templates');
  
    for(var i = 0; i < emailtemplates.length; i++) {
      const f = emailtemplates[i];
      const template = f.split('.')[0];
  
      try {
        if (log) console.log(' - Importing template ' + f);
        const content = fs.readFileSync(__root + '/email_templates/' + f).toString();
        const query = `UPDATE email_templates:${template} SET content=${JSON.stringify(content)}`;
        if (log) console.log(' + Executing');
        await db.query(query);
      } catch(e) {
        if (log) console.log(' ! An error occured while processing file: ' + f);
        if (log) console.log(e);
      }
    }

    const envvars = Object.keys(env).filter(k => k.toUpperCase().startsWith("KARDS_ENV_"));
    if (envvars.length > 0) {
        if (log) console.log('\nMigrating predefined environment keys');

        for(var i = 0; i < envvars.length; i++) {
            const key = envvars[i].slice('KARDS_ENV_'.length).toLowerCase();
            const query = `UPDATE environment:${key} SET value=${JSON.stringify(env[envvars[i]])}`;
            if (log) console.log(' - Setting environment key ' + key);
            if (log) console.log(' + Executing');
            await db.query(query);
        }
    } else {
        if (log) console.log("No predefined envvars, update yourself accordingly in admin panel.");
    }

    if (env.KARDS_DEFAULT_ADMIN) {
        if (log) console.log("\nDetected default admin credentials");

        const user = JSON.parse(env.KARDS_DEFAULT_ADMIN);
        if (user.name && user.email && user.password) {
            const query = `CREATE admin SET name=${JSON.stringify(user.name)}, email=${JSON.stringify(user.email)}, password=crypto::argon2::generate(${JSON.stringify(user.password)})`;
            if (log) console.log(' + Executing');
            await db.query(query);
        } else {
            if (log) console.log("Invalid user object, skipping it.");
        }
    }
  
    if (log) console.log('\nFinished database migrations');
    if (exit) process.exit(0);
}
