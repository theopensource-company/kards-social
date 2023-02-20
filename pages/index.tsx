import React from 'react';
import Link from 'next/link';

import styles from '../styles/pages/Landing.module.scss';
import Logo from '../components/Logo';
import LayoutContentMiddle from '../components/Layout/ContentMiddle';
import { useFeatureFlag } from '../hooks/Environment';
import { useTranslation } from 'react-i18next';

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
