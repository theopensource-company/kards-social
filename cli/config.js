import readline from 'readline';
import { Surreal } from '@theopensource-company/surrealdb-cloudflare';
import fetch from 'node-fetch';
import fs from 'fs';
import crypto from 'crypto';
import concurrently from 'concurrently';

var config = {};
try {
  config = JSON.parse(fs.readFileSync('config.json').toString()) ?? {};
} catch(e) {}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dbfiles = [
  'admin.surql',
  'auth.surql',
  'event.surql',
  'log.surql',
  'user.surql',
  'verify_email.surql',
  'waitlist.surql',
];

const conffiles = [
  {
    source: 'workers/waitlist/wrangler.example.toml',
    target: 'workers/waitlist/wrangler.toml'
  },
  {
    source: 'workers/user/wrangler.example.toml',
    target: 'workers/user/wrangler.toml'
  },
  {
    source: 'workers/admin/wrangler.example.toml',
    target: 'workers/admin/wrangler.toml'
  }
];

const jwtdummysecrets = {
  waitlist_jwt_secret: 0,
  admin_access_jwt_secret: 0,
  admin_jwt_secret: 0,
  user_jwt_secret: 0
};

const createSecureSecret = async () => await new Promise(resolve => crypto.randomBytes(1024, function(err, buffer) {
  resolve(buffer.toString('hex'));
})) 

const prompt = async (p, def, allowEmpty = false) => await new Promise(response => rl.question(`${p}${def ? ` (${def.length > 100 ? def.slice(0, 100) + ' [...]' : def})` : ''}: `, async res => response(!res && def ? def : (!res && !allowEmpty ? await prompt(p, def) : res))));

const createEnvironment = async (current) => {
  return {
    surreal_host:             await prompt(`Surreal host`, current.surreal_host),
    surreal_user:             await prompt(`Surreal user`, current.surreal_user),
    surreal_pass:             await prompt(`Surreal pass`, current.surreal_pass),
    surreal_ns:               await prompt(`Surreal namespace`, current.surreal_ns),
    surreal_db:               await prompt(`Surreal database`, current.surreal_db),
    kv_ratelimit:             await prompt(`Ratelimit KV ID`, current.kv_ratelimit),
    waitlist_jwt_secret:      await prompt(`Waitlist JWT secret`, current.waitlist_jwt_secret || await createSecureSecret()),
    user_jwt_secret:          await prompt(`User JWT secret`, current.user_jwt_secret || await createSecureSecret()),
    admin_jwt_secret:         await prompt(`Admin JWT secret`, current.admin_jwt_secret || await createSecureSecret()),
    admin_access_jwt_secret:  await prompt(`Admin Access JWT secret`, current.admin_access_jwt_secret || await createSecureSecret()),
    sendgrid_key:             await prompt(`Sendgrid API key`, current.sendgrid_key)
  };
}

let runners;
const migrateDatabase = async (c) => {
  if ((await prompt('Are you sure? [y/n]')).toLowerCase() !== 'y') return;
  if (c.surreal_host.includes('localhost') || c.surreal_host.includes('127.0.0.1') || c.surreal_host.includes('0.0.0.0')) {
    if (!runners && (await prompt('Do you want to spin up a local database instance? [y/n]')).toLowerCase() == 'y') {
      runners = concurrently(
        [
          {
            name: "surrealdb",
            command: "surreal start --user root --pass root --bind 0.0.0.0:12001 file:dev.db"
          }
        ]
      );

      await new Promise((resolve) => setTimeout(() => resolve(), 1000));
    } else if (runners) {
      console.log("Local database instance is already running");
    }
  }

  const db = new Surreal({
    host: c.surreal_host,
    username: c.surreal_user,
    password: c.surreal_pass,
    namespace: c.surreal_ns,
    database: c.surreal_db
  }, fetch);

  console.log('\nStarting database migrations\n');

  for(var i = 0; i < dbfiles.length; i++) {
    const f = dbfiles[i];

    try {
      console.log(' - Importing file ' + f);
      const q = fs.readFileSync('tables/' + f).toString();
      console.log(' + Executing');
      await db.query(q);
    } catch(e) {
      console.log(' ! An error occured while processing file: ' + f);
      console.log(e);
    }
  }

  console.log('\nFinished database migrations');
  if (runners) console.log("Local database instance will be closed once you exit the configuration tool.");
}

const createConfigFiles = async (c) => {
  if ((await prompt('Are you sure? [y/n]')).toLowerCase() !== 'y') return;

  console.log('\nStarting config writes\n');
  
  conffiles.forEach(item => {
    try {
      console.log(` - Processing "${item.source}"`);
      const template = fs.readFileSync(item.source).toString();
      fs.writeFileSync(item.target, template.replaceAll(/"INSERT_(?:PROD|DEV)_[A-Z_]+[A-Z]"/gi, (a) => {
        a = a.toLowerCase().slice(1, -1);
        const env = a.split('_')[1];
        const opt = a.split('_').slice(2).join('_');
        if (!c[env]) return "\"MISSING_ENV\"";
        if (!c[env][opt]) console.log(` ! Unknown option "${opt}" for env "${env}"`);
        return `"${c[env][opt] ?? "UNKNOWN_OPTION"}"`;
      }));
      console.log(` + Saved "${item.target}"`);
    } catch(e) {
      console.log(' ! Unable to process item');
      console.log(e);
    };
  });

  console.log('\nFinished config writes\n');
}

const envIsValid = c => c && c.surreal_host && c.surreal_user && c.surreal_pass && c.surreal_ns && c.surreal_db && c.kv_ratelimit && c.sendgrid_key && c.waitlist_jwt_secret && c.user_jwt_secret && c.admin_jwt_secret && c.admin_access_jwt_secret;

const start = async () => {
  try {
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
  } catch (err) {
    console.log('  !!! Error saving config');
  }

  if (!config.guidedDevConfig && !envIsValid(config.dev)) {
    config.guidedDevConfig = true;
    if ((await prompt('Do you want to create a development environment? [y/n]')).toLowerCase() === 'y') config.dev = await createEnvironment(config.dev ?? config.prod ? {...config.prod, ...jwtdummysecrets} : null ?? {
      // surreal_host: 'http://127.0.0.1:12001',
      surreal_user: 'root',
      // surreal_pass: 'root',
      // surreal_ns: 'dev',
      surreal_db: 'kards-social'
    });
    return start();
  }

  if (!config.guidedProdConfig && !envIsValid(config.prod)) {
    config.guidedProdConfig = true;
    if ((await prompt('Do you want to create a production environment? [y/n]')).toLowerCase() === 'y') config.prod = await createEnvironment(config.prod ?? config.dev ? {...config.dev, ...jwtdummysecrets} : null ?? {
      surreal_user: 'root',
      surreal_db: 'kards-social'
    });
    return start();
  }

  if (envIsValid(config.dev) && !config.guidedDevMigration) {
    config.guidedDevMigration = true;
    if ((await prompt('Do you want to migrate your dev database? [y/n]')).toLowerCase() === 'y') await migrateDatabase(config.dev);
    return start();
  }

  if (envIsValid(config.prod) && !config.guidedProdMigration) {
    config.guidedProdMigration = true;
    if ((await prompt('Do you want to migrate your prod database? [y/n]')).toLowerCase() === 'y') await migrateDatabase(config.prod);
    return start();
  }
  
  if (!config.guidedConfigCreation) {
    config.guidedConfigCreation = true;
    if ((await prompt('Do you want to create the config files? [y/n]')).toLowerCase() === 'y') await createConfigFiles(config);
    return start();
  }

  console.log('\nEnv configuration:');
  console.log('---------------------');
  console.log(' 1. Change development environment');
  console.log(' 2. Change production environment');
  console.log(' 3. Migration dev database');
  console.log(' 4. Migration prod database');
  console.log(' 5. Create config files');
  console.log(' 6. Exit');
  const option = await prompt('\nOption', 0, true);

  console.clear();
  switch(parseInt(option)) {
    case 1:
      config.dev = await createEnvironment(envIsValid(config.dev) ? config.dev : (config.dev ?? {...config.prod, ...jwtdummysecrets} ?? {
        surreal_user: 'root',
        surreal_db: 'kards-social'
      }));
      return start();
    case 2:
      config.prod = await createEnvironment(envIsValid(config.prod) ? config.prod : (config.prod ?? {...config.dev, ...jwtdummysecrets} ?? {
        surreal_user: 'root',
        surreal_db: 'kards-social'
      }));
      return start();
    case 3:
      if (!envIsValid(config.dev)) {
        console.log('Your development environment is not valid!');
        return start();
      }
      await migrateDatabase(config.dev);
      return start();
    case 4:
      if (!envIsValid(config.prod)) {
        console.log('Your production environment is not valid!');
        return start();
      }
      await migrateDatabase(config.prod);
      return start();
    case 5:
      if (!envIsValid(config.dev) && (await prompt('Your development environment is not valid, do you want to continue? [y/n]')).toLowerCase() !== 'y') return start();
      if (!envIsValid(config.prod) && (await prompt('Your production environment is not valid, do you want to continue? [y/n]')).toLowerCase() !== 'y') return start();
      await createConfigFiles(config);
      return start();
    case 6:
      rl.close();
      return;
    default: 
      return start();
  }
}

start();
  
rl.on('close', function () {
  try {
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
    console.log('\n(i) Saved config\n');
  } catch (err) {
    console.log('\n!!! Error saving config\n');
  }
  exit();
});

async function exit() {
  console.log("Caught interrupt signal");

  if (runners) {
    console.log('\nClosing local database instance');
    await runners.commands[0].kill();
    setTimeout(() => process.exit(0), 1000);
  } else {
    process.exit(0);
  }
}

process.on('uncaughtException', exit);
process.on('SIGINT', exit);