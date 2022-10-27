import React from 'react';
import Link from 'next/link';

import styles from '../styles/Landing.module.scss';
import Logo from '../components/Logo';
import LayoutContentMiddle from '../components/Layout/ContentMiddle';

export default function Landing() {
    return (
        <LayoutContentMiddle>
            <div className={styles.content}>
                <div className="image-frame">
                    <Logo />
                </div>

                <h1>Opening up soon</h1>
                <span>
                    <Link href="/join-waitlist">
                        <a>Reserve your spot now</a>
                    </Link>
                </span>

                <p>
                    Kards is an open social media platform, free from abusive
                    data harvesting and damaging algorithms.
                </p>
            </div>
        </LayoutContentMiddle>
    );
}
