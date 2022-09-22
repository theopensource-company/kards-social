import readline from 'readline';
import { Surreal } from '@theopensource-company/surrealdb-cloudflare';
import fetch from 'node-fetch';
import fs from 'fs';
import crypto from 'crypto';

var config = {};
try {
  config = JSON.parse(fs.readFileSync('config.json').toString()) ?? {};
} catch(e) {}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dbfiles = [
  'event.sql',
  'waitlist.sql'
]

const conffiles = [
  {
    source: 'workers/waitlist/wrangler.example.toml',
    target: 'workers/waitlist/wrangler.toml'
  }
];

const jwtdummysecrets = {
  waitlist_jwt_secret: 0
};

const createSecureSecret = async () => await new Promise(resolve => crypto.randomBytes(1024, function(err, buffer) {
  resolve(buffer.toString('hex'));
})) 

const prompt = async (p, def, allowEmpty = false) => await new Promise(response => rl.question(`${p}${def ? ` (${def.length > 100 ? def.slice(0, 100) + ' [...]' : def})` : ''}: `, async res => response(!res && def ? def : (!res && !allowEmpty ? await prompt(p, def) : res))));

const createEnvironment = async (current) => {
  return {
    surreal_host:       await prompt(`Surreal host`, current.surreal_host),
    surreal_user:       await prompt(`Surreal user`, current.surreal_user),
    surreal_pass:       await prompt(`Surreal pass`, current.surreal_pass),
    surreal_ns:         await prompt(`Surreal namespace`, current.surreal_ns),
    surreal_db:         await prompt(`Surreal database`, current.surreal_db),
    kv_ratelimit:       await prompt(`Ratelimit KV ID`, current.kv_ratelimit),
    waitlist_jwt_secret: await prompt(`Waitlist JWT secret`, current.waitlist_jwt_secret ?? await createSecureSecret()),
    sendgrid_key:       await prompt(`Sendgrid API key`, current.sendgrid_key)
  };
}

const migrateDatabase = async (c) => {
  if ((await prompt('Are you sure? [y/n]')).toLowerCase() !== 'y') return;
  if ((await prompt('Is your database reachable? [y/n]')).toLowerCase() !== 'y') return;
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
      console.log(' ! An error occured while importing file: ' + f);
      console.log(e);
    }
  }

  console.log('\nFinished database migrations');
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

const envIsValid = c => c && c.surreal_host && c.surreal_user && c.surreal_pass && c.surreal_ns && c.surreal_db && c.kv_ratelimit && c.sendgrid_key && c.waitlist_jwt_secret;

const start = async () => {
  try {
    fs.writeFileSync('config.json', JSON.stringify(config, null, 2));
  } catch (err) {
    console.log('  !!! Error saving config');
  }

  if (!envIsValid(config.dev)) {
    console.log("Create a development environment configuration\n==========\n");
    config.dev = await createEnvironment(config.dev ?? {...config.prod, ...jwtdummysecrets} ?? {
      surreal_user: 'root',
      surreal_db: 'kards-social'
    });
    return start();
  }

  if (!envIsValid(config.prod)) {
    console.log("Create a production environment configuration (enter random stuff if you don't have them :D)\n==========\n");
    config.prod = await createEnvironment(config.prod ?? {...config.dev, ...jwtdummysecrets} ?? {
      surreal_user: 'root',
      surreal_db: 'kards-social'
    });
    return start();
  }

  if (!config.guidedDevMigration) {
    config.guidedDevMigration = true;
    if ((await prompt('Do you want to migrate your dev database? [y/n]')).toLowerCase() === 'y') await migrateDatabase(config.dev);
    return start();
  }

  if (!config.guidedProdMigration) {
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
      config.dev = await createEnvironment(config.dev);
      return start();
    case 2:
      config.prod = await createEnvironment(config.prod);
      return start();
    case 3:
      await migrateDatabase(config.dev);
      return start();
    case 4:
      await migrateDatabase(config.prod);
      return start();
    case 5:
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
  process.exit(0);
});