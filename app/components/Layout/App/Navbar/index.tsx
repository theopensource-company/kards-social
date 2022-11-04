import React from 'react';
import { LogoSmall } from '../../../Logo';
import styles from '../../../../styles/components/layout/App/Navbar.module.scss';
import { useIsAuthenticated } from '../../../../hooks/KardsUser';
import Link from 'next/link';
import { SurrealSignout } from '../../../../lib/Surreal';
import { ButtonSmall } from '../../../Button';
import NavbarIconDropdown from './IconDropdown';

export default function AppLayoutNavbar() {
    const authenticated = useIsAuthenticated();

    function Signout(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        SurrealSignout().then(() => {
            // TODO: invalidate is currently broken, change when fixed: https://github.com/surrealdb/surrealdb/issues/1314
            // should refresh details and navigate with next router.
            // refreshUserDetails()
            location.href = '/';
        });
    }

    return (
        <div className={styles.navbar}>
            <Link href="/">
                <LogoSmall className={styles.logo} />
            </Link>
            <div>
                {authenticated ? (
                    <NavbarIconDropdown icon="User">
                        <Link href="/account">Account</Link>
                        <a href="#" onClick={Signout}>
                            Signout
                        </a>
                    </NavbarIconDropdown>
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
