import React from 'react';
import Link from 'next/link';

import styles from '../styles/pages/Landing.module.scss';
import Logo from '../components/Logo';
import LayoutContentMiddle from '../components/Layout/ContentMiddle';
import { useFeatureFlag } from '../hooks/Environment';
import AppLayout from '../components/Layout/App';

export default function Landing() {
    const preLaunchPage = useFeatureFlag('preLaunchPage');
    return preLaunchPage ? (
        <LayoutContentMiddle>
            <div className={styles.content}>
                <div className="image-frame">
                    <Logo />
                </div>

                <h1>Opening up soon</h1>
                <span>
                    <Link href="/join-waitlist">Reserve your spot now</Link>
                </span>

                <p>
                    Kards is an open social media platform, free from abusive
                    data harvesting and damaging algorithms.
                </p>
            </div>
        </LayoutContentMiddle>
    ) : (
        <AppLayout>Hello</AppLayout>
    );
}
