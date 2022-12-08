import React from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Cross from '../components/Icon/Cross';
import Info from '../components/Icon/Info';
import '../hooks/Surreal'; //Initialize surrealdb instance
import { InitializeSurreal } from '../hooks/Surreal';
import { AuthProvider } from '../hooks/KardsUser';
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../locales';
import { DevButton } from '../components/DevButton';

export default function KardsSocial({ Component, pageProps }: AppProps) {
    return (
        <I18nextProvider i18n={i18n}>
            <InitializeSurreal>
                <AuthProvider>
                    <DevButton />
                    <Component {...pageProps} />
                    <ToastContainer
                        position="top-center"
                        closeButton={false}
                        icon={({ type }) => {
                            return type == 'error' ? (
                                <Cross size={15} color="Light" />
                            ) : (
                                <Info
                                    color={
                                        type == 'default' ? undefined : 'Light'
                                    }
                                />
                            );
                        }}
                    />
                </AuthProvider>
            </InitializeSurreal>
        </I18nextProvider>
    );
}
