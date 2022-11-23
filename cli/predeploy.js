import { Surreal } from '@theopensource-company/surrealdb-cloudflare';
import fetch from 'node-fetch';
import fs from 'fs';

// if (!process.env.SURREAL_HOST || !process.env.SURREAL_USERNAME || !process.env.SURREAL_PASSWORD || !process.env.SURREAL_NAMESPACE || !process.env.SURREAL_DATABASE) {
//     console.error("One or more environment variables are missing");
//     process.exit(1);
// }

const dbfiles = fs.readdirSync('../tables');
const emailtemplates = fs.readdirSync('../email_templates');

const migrateDatabase = async () => {
    console.log("\nHost: " + process.env.SURREAL_HOST);
    console.log("NS: " + process.env.SURREAL_NAMESPACE);
    console.log("DB: " + process.env.SURREAL_DATABASE);

    const db = new Surreal({
      host: process.env.SURREAL_HOST,
      username: process.env.SURREAL_USERNAME,
      password: process.env.SURREAL_PASSWORD,
      namespace: process.env.SURREAL_NAMESPACE,
      database: process.env.SURREAL_PASSWORD
    }, fetch);
  
    console.log('\nStarting database migrations\n');
  
    for(var i = 0; i < dbfiles.length; i++) {
      const f = dbfiles[i];
  
      try {
        console.log(' - Importing file ' + f);
        const q = fs.readFileSync('../tables/' + f).toString();
        console.log(' + Executing');
        await db.query(q);
      } catch(e) {
        console.log(' ! An error occured while processing file: ' + f);
        console.log(e);
      }
    }
  
    console.log('\nMigrating email templates');
  
    for(var i = 0; i < emailtemplates.length; i++) {
      const f = emailtemplates[i];
      const template = f.split('.')[0];
  
      try {
        console.log(' - Importing template ' + f);
        const content = fs.readFileSync('../email_templates/' + f).toString();
        const query = `UPDATE email_templates:${template} SET content=${JSON.stringify(content)}`;
        console.log(' + Executing');
        await db.query(query);
      } catch(e) {
        console.log(' ! An error occured while processing file: ' + f);
        console.log(e);
      }
    }

    const envvars = Object.keys(process.env).filter(k => k.toUpperCase().startsWith("KARDS_ENV_"));
    if (envvars.length > 0) {
        console.log('\nMigrating predefined environment keys');

        for(var i = 0; i < envvars.length; i++) {
            const key = envvars[i].slice('KARDS_ENV_'.length).toLowerCase();
            const query = `UPDATE environment:${key} SET value=${JSON.stringify(process.env[envvars[i]])}`;
            console.log(' - Setting environment key ' + key);
            console.log(' + Executing');
            await db.query(query);
        }
    } else {
        console.log("No predefined envvars, update yourself accordingly in admin panel.");
    }

    if (process.env.KARDS_DEFAULT_ADMIN) {
        console.log("\nDetected default admin credentials");

        const user = JSON.parse(process.env.KARDS_DEFAULT_ADMIN);
        if (user.name && user.email && user.password) {
            const query = `CREATE admin CONTENT ${JSON.stringify(user)}`;
            console.log(' + Executing');
            await db.query(query);
        } else {
            console.log("Invalid user object, skipping it.");
        }
    }
  
    console.log('\nFinished database migrations');
    process.exit(0);
}

migrateDatabase();