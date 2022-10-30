import React from 'react';
import { LogoSmall } from '../../Logo';
import styles from '../../../styles/components/layout/App/Navbar.module.scss';
import {
    useIsAuthenticated,
} from '../../../hooks/KardsUser';
import Link from 'next/link';
import { SurrealSignout } from '../../../lib/Surreal';
import { ButtonSmall } from '../../Button';

export default function AppLayoutNavbar() {
    const authenticated = useIsAuthenticated();

    return (
        <div className={styles.navbar}>
            <Link href="/">
                <LogoSmall className={styles.logo} />
            </Link>
            <div>
                {authenticated ? (
                    <>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                SurrealSignout().then(() => {
                                    // TODO: invalidate is currently broken, change when fixed: https://github.com/surrealdb/surrealdb/issues/1314
                                    // should refresh details and navigate with next router.
                                    // refreshUserDetails()
                                    location.href = '/';
                                });
                            }}
                        >
                            Signout
                        </a>
                        <Link href="/account">
                            Account
                        </Link>
                    </>
                ) : (
                    <>
                        <Link href="/auth/signin">
                            <ButtonSmall text="Signin" />
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}
