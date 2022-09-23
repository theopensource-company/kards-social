import concurrently from 'concurrently';
import httpProxy from 'http-proxy';
import express from 'express';

const target = {
    app:            'http://127.0.0.1:12010',
    waitlistApi:    'http://127.0.0.1:12011'
};

const appProxy = express();
const proxyserver = httpProxy.createProxyServer({ target: target.app, ws: true });

appProxy.all("/api/waitlist/*", (req, res) => proxyserver.web(req, res, {target: target.waitlistApi}));
appProxy.all("/*", (req, res) => proxyserver.web(req, res, {target: target.app}));

const runners = concurrently(
    [
        {
            name: "kards-app",
            command: "cd app && pnpm run dev",
        },
        {
            name: "kards-worker-waitlist",
            command: "cd workers/waitlist && wrangler dev --env=dev"
        },
    ],
);

setTimeout(() => {
    const appProxyServer = appProxy.listen(12000, () => console.log('[PROXY-APP] APP: http://127.0.0.1:12000'));
    appProxyServer.on('upgrade', (req, socket, head) => proxyserver.ws(req, socket, head));

    async function exit() {
        console.log("Caught interrupt signal");

        for(var i = 0; i < runners.commands.length; i++) {
            console.log(`Closing runner "${runners.commands[i].name}".`);
            await runners.commands[i].kill();
        }

        console.log('Closing proxy for app');
        appProxyServer.close();

        process.exit(0);
    }

    process.on('uncaughtException', exit);
    process.on('SIGINT', exit);
}, 3000);