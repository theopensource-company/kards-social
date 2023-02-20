import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import 'react-image-crop/dist/ReactCrop.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { DevButton } from '../components/DevButton';
import { IAmRoot } from '../components/IAmRoot';
import Cross from '../components/Icon/Cross';
import Info from '../components/Icon/Info';
import AppLayoutNavbar from '../components/Layout/Navbar';
import { TFeatureFlagOptions } from '../constants/Types/FeatureFlags.types';
import { FeatureFlagContext, FeatureFlagProvider } from '../hooks/Environment';
import { AuthProvider } from '../hooks/KardsUser';
import '../hooks/Surreal'; //Initialize surrealdb instance
import { InitializeSurreal } from '../hooks/Surreal';
import { i18n } from '../locales';
import '../styles/globals.scss';

export default function KardsSocial({
    Component,
    pageProps,
}: AppProps & {
    Component: NextPage & {
        hideNavbar?:
            | boolean
            | `withFeatureFlag:${TFeatureFlagOptions}`
            | `withoutFeatureFlag:${TFeatureFlagOptions}`;
    };
}) {
    return (
        <I18nextProvider i18n={i18n}>
            <InitializeSurreal>
                <AuthProvider>
                    <FeatureFlagProvider>
                        <FeatureFlagContext.Consumer>
                            {(fflags) => (
                                <>
                                    <DevButton />
                                    {(() => {
                                        if (Component.hideNavbar === undefined)
                                            return true;
                                        if (
                                            typeof Component.hideNavbar ===
                                            'boolean'
                                        )
                                            return !Component.hideNavbar;

                                        if (
                                            Component.hideNavbar.startsWith(
                                                'withFeatureFlag:'
                                            )
                                        )
                                            return !fflags[
                                                Component.hideNavbar.split(
                                                    ':'
                                                )[1] as TFeatureFlagOptions
                                            ];

                                        return fflags[
                                            Component.hideNavbar.split(
                                                ':'
                                            )[1] as TFeatureFlagOptions
                                        ];
                                    })() && <AppLayoutNavbar />}
                                    <Component {...pageProps} />
                                    <IAmRoot />
                                    <ToastContainer
                                        position="top-center"
                                        closeButton={false}
                                        icon={({ type }) => {
                                            return type == 'error' ? (
                                                <Cross
                                                    size={15}
                                                    color="Light"
                                                />
                                            ) : (
                                                <Info
                                                    color={
                                                        type == 'default'
                                                            ? undefined
                                                            : 'Light'
                                                    }
                                                />
                                            );
                                        }}
                                    />
                                </>
                            )}
                        </FeatureFlagContext.Consumer>
                    </FeatureFlagProvider>
                </AuthProvider>
            </InitializeSurreal>
        </I18nextProvider>
    );
}
