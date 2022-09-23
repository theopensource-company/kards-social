import readline from 'readline';
import { Surreal } from '@theopensource-company/surrealdb-cloudflare';
import fetch from 'node-fetch';
import fs from 'fs';
import util from 'util';

var config = {};
try {
  config = JSON.parse(fs.readFileSync('config.json').toString()) ?? {};
} catch(e) {}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const prompt = async (p, def, allowEmpty = false) => await new Promise(response => rl.question(`${p}${def ? ` (${def.length > 100 ? def.slice(0, 100) + ' [...]' : def})` : ''}: `, async res => response(!res && def ? def : (!res && !allowEmpty ? await prompt(p, def) : res))));
const envIsValid = c => c && c.surreal_host && c.surreal_user && c.surreal_pass && c.surreal_ns && c.surreal_db && c.kv_ratelimit && c.sendgrid_key && c.waitlist_jwt_secret;

const createShell = async (c) => {
    if ((await prompt('Is your database reachable? [y/n]')).toLowerCase() !== 'y') return;
    const db = new Surreal({
      host: c.surreal_host,
      username: c.surreal_user,
      password: c.surreal_pass,
      namespace: c.surreal_ns,
      database: c.surreal_db
    }, fetch);

    const shell = async () => {
        const input = await prompt('Query ');
        if (input == 'exit') return start();
        console.log(' ');
        console.group();
        console.log(util.inspect(await db.query(input), { colors: true, depth: 100 }));
        console.groupEnd();
        console.log(' ');
        shell();
    }

    shell();
}

const start = async () => {  
    const options = [];
    if (envIsValid(config.dev)) options.push({
        name: "Connect to development database",
        runner: () => createShell(config.dev)
    });
  
    if (envIsValid(config.prod)) options.push({
        name: "Connect to production database",
        runner: () => createShell(config.prod)
    });

    if (options.length == 0) {
        console.log('\nYou have not setup an environment. Use "pnpm conf" to set one up.\n');
        rl.close();
        return;
    }

    options.push({
        name: "Exit",
        runner: () => rl.close()
    });

    console.log('\nChoose an environment:');
    console.log('---------------------');
    options.forEach((a, i) => console.log(` ${i+1}. ${a.name}`));
    const option = await prompt('\nOption', 0, true);
  
    console.clear();
    if (!options[parseInt(option) - 1]) return start();
    options[parseInt(option) - 1].runner();
}
  
start();

rl.on('close', function () {
    console.log('Bye!');
    process.exit(0);
});