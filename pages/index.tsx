import Link from 'next/link';
import React from 'react';

import { useTranslation } from 'react-i18next';
import LayoutContentMiddle from '../components/Layout/ContentMiddle';
import Logo from '../components/Logo';
import { useFeatureFlag } from '../hooks/Environment';
import styles from '../styles/pages/Landing.module.scss';

export default function Landing() {
    const preLaunchPage = useFeatureFlag('preLaunchPage');
    const { t } = useTranslation('pages');

    return preLaunchPage ? (
        <LayoutContentMiddle>
            <div className={styles.content}>
                <div className="image-frame">
                    <Logo />
                </div>

                <h1>{t('home.preLaunch.title')}</h1>
                <span>
                    <Link href="/join-waitlist">
                        {t('home.preLaunch.reserve-spot')}
                    </Link>
                </span>

                <p>{t('home.preLaunch.description')}</p>
            </div>
        </LayoutContentMiddle>
    ) : (
        <p>Hello</p>
    );
}

Landing.hideNavbar = 'withFeatureFlag:preLaunchPage';
