import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { dangerouslySkipEscape, escapeInject } from 'vite-plugin-ssr';
import KardsSocial from './_app';

export { render };
export { passToClient };

// See https://vite-plugin-ssr.com/data-fetching
const passToClient = ['pageProps'];

function render(pageContext) {
    const { Page, pageProps } = pageContext;
    const pageHtml = ReactDOMServer.renderToString(
        <KardsSocial Component={Page} pageProps={pageProps} />
    );

    return escapeInject`<!DOCTYPE html>
    <html>
      <body>
        <div id="page-view">${dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`;
}
