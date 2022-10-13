import concurrently from 'concurrently';
import httpProxy from 'http-proxy';
import express from 'express';

const target = {
    app:            'http://127.0.0.1:12010',
    waitlistApi:    'http://127.0.0.1:12011',
    userApi:        'http://127.0.0.1:12012'
};

const appProxy = express();
const proxyserver = httpProxy.createProxyServer({ target: target.app, ws: true });
const safeProxy = (req, res, opt) => {
    try {
        return proxyserver.web(req, res, opt);
    } catch(e) {
        console.log("One of the processes seems to be unavailable, closing the devserver.");
        console.log(" - " + opt.target);
        return exit();
    }
}

appProxy.all("/api/waitlist/*", (req, res) => safeProxy(req, res, {target: target.waitlistApi}));
appProxy.all("/api/user/*", (req, res) => safeProxy(req, res, {target: target.userApi}));
appProxy.all("/*", (req, res) => safeProxy(req, res, {target: target.app}));

// All workers but the first one have to wait 1 second to make sure that the first worker started. Otherwise the workers will start to complain about previously used ports.

const runners = concurrently(
    [
        {
            name: "kards-app",
            command: "cd app && pnpm run dev",
        },
        {
            name: "kards-worker-waitlist",
            command: "cd workers/waitlist && wrangler dev --env=dev --experimental-local"
        },
        {
            name: "kards-worker-user",
            command: "sleep 1; cd workers/user && wrangler dev --env=dev --experimental-local"
        },
    ],
);

let appProxyServer;
setTimeout(() => {
    appProxyServer = appProxy.listen(12000, () => console.log('[PROXY-APP] APP: http://localhost:12000'));
    appProxyServer.on('upgrade', (req, socket, head) => proxyserver.ws(req, socket, head));
}, 5000);

async function exit() {
    console.log("Caught interrupt signal");

    for(var i = 0; i < runners.commands.length; i++) {
        console.log(`Closing runner "${runners.commands[i].name}".`);
        await runners.commands[i].kill();
    }

    console.log('Closing proxy for app');
    appProxyServer.close();

    setTimeout(() => process.exit(0), 1000);
}

process.on('uncaughtException', exit);
process.on('SIGINT', exit);