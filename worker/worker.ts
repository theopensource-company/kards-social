const worker = {
    async fetch(request: Request, env: unknown): Promise<Response> {
        try {
            return handleFetchEvent(request, env);
        } catch (e) {
            console.log(e);
            return new Response('Internal Error', { status: 500 });
        }
    },
};

export default worker;

async function handleFetchEvent(
    request: Request,
    env: unknown
): Promise<Response> {
    if (!isAssetUrl(request.url)) {
        const response = await handleSsr(request.url);
        if (response !== null) return response;
    }

    return env.ASSETS.fetch(request);
    // Optional security headers, comment out if not needed.
    // Modifying original response directly errors out in production: https://github.com/cloudflare/miniflare/issues/243
    // Workaround: Create a new Response object with the headers you want to add and the original's body.
    // const upstreamResponse: Response = await env.ASSETS.fetch(request);
    // const response: Response = new Response(upstreamResponse.body, {
    //   status: upstreamResponse.status,
    //   statusText: upstreamResponse.statusText,
    //   headers: upstreamResponse.headers,
    // });
    // response.headers.set("X-XSS-Protection", "1; mode=block");
    // response.headers.set("X-Content-Type-Options", "nosniff");
    // response.headers.set("X-Frame-Options", "DENY");
    // response.headers.set("Referrer-Policy", "unsafe-url");
    // response.headers.set("Feature-Policy", "none");
    // return response;
}
function isAssetUrl(url: string) {
    const { pathname } = new URL(url);
    return pathname.startsWith('/assets/');
}

import { createPageRenderer } from 'vite-plugin-ssr';
// `importBuild.js` enables us to bundle our worker code into a single file, see https://vite-plugin-ssr.com/cloudflare-workers and https://vite-plugin-ssr.com/importBuild.js
import '../dist/server/importBuild.js';

const renderPage = createPageRenderer({ isProduction: true });

async function handleSsr(url: string) {
    const pageContextInit = { url };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) {
        return null;
    } else {
        const { readable, writable } = new TransformStream();
        httpResponse.pipeToWebWritable(writable);
        return new Response(readable);
    }
}
