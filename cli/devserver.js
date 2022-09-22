import concurrently from 'concurrently';
import httpProxy from 'http-proxy';
import express from 'express';
import cors from 'cors';

const appProxy = express();
const apiProxy = express();
const proxyserver = httpProxy.createProxyServer();
const target = {
    app:            'http://127.0.0.1:12010',
    waitlistApi:    'http://127.0.0.1:12011'
};

appProxy.use(cors());
apiProxy.use(cors());

appProxy.all("/*", (req, res) => proxyserver.web(req, res, {target: target.app}));
apiProxy.all("/waitlist/*", (req, res) => proxyserver.web(req, res, {target: target.waitlistApi}));

const runners = concurrently(
    [
        {
            name: "kards-surreal",
            command: "surreal start --user root --pass root file:dev.db"
        },
        {
            name: "kards-app",
            command: "cd app && pnpm run dev",
            env: {
                NEXT_PUBLIC_KARDS_API: "http://localhost:12001"
            },
        },
        {
            name: "kards-worker-waitlist",
            command: "cd workers/waitlist && wrangler dev --env=dev",
            env: {
                KARDS_API: "http://localhost:12001"
            }
        },
    ],
);

setTimeout(() => {
    const appProxyServer = appProxy.listen(12000, () => console.log('[PROXY-APP] APP: http://127.0.0.1:12000'));
    const apiProxyServer = apiProxy.listen(12001, () => console.log('[PROXY-API] API: http://127.0.0.1:12001'));

    process.on('SIGINT', async function() {
        console.log("Caught interrupt signal");

        for(var i = 0; i < runners.commands.length; i++) {
            console.log(`Closing runner "${runners.commands[i].name}".`);
            await runners.commands[i].kill();
        }

        console.log('Closing proxy for app');
        appProxyServer.close();
        console.log('Closing proxy for api');
        apiProxyServer.close();

        process.exit(0);
    });
}, 3000);