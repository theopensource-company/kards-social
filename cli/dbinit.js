import readline from 'readline';
import { Surreal } from '@theopensource-company/surrealdb-cloudflare';
import fetch from 'node-fetch';
import fs from 'fs';

const files = [
    'event.sql',
    'waitlist.sql'
]

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

new Promise(async resolve => {
    console.log('If you want to run a local database, please start one with the following command:');
    console.log('surreal start --user root --pass root file:dev.db');
    console.log('\nThen proceed to use the following details');
    console.log('HTTP endpoint: http://127.0.0.1:8000');
    console.log('Username: root');
    console.log('Password: root');
    console.log('\nYou can now enter your preferred database details:\n=========\n');

    resolve({
        host: await new Promise(response => rl.question('HTTP endpoint: ', a => response(a))),
        username: await new Promise(response => rl.question('Username: ', a => response(a))),
        password: await new Promise(response => rl.question('Password: ', a => response(a)))
    })
}).then(async res => {
    const db = new Surreal({
        ...res,
        namespace: 'theopensource-company',
        database: 'kards-social'
    }, fetch);

    console.log('\nStarting database migrations');

    for(var i = 0; i < files.length; i++) {
        const f = files[i];

        try {
            console.log('Importing file ' + f);
            const q = fs.readFileSync('tables/' + f).toString();
            console.log(q);
            console.log('Executing');
            await db.query(q);
        } catch(e) {
            console.log('An error occured while importing file: ' + f);
            console.log(e);
        }
    }

    rl.close();
})
  
rl.on('close', async function () {
    console.log('\nDone');
    process.exit(0);
});