export { render };

import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import KardsSocial from './_app';

async function render(pageContext) {
    const { Page, pageProps } = pageContext;
    hydrateRoot(
        document.getElementById('page-view')!,
        <KardsSocial Component={Page} pageProps={pageProps} />
    );
}
