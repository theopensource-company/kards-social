import React from 'react';
import { LogoSmall } from '../../Logo';
import styles from '../../../styles/components/layout/App/Navbar.module.scss';
import { useIsAuthenticated } from '../../../hooks/KardsUser';
import Link from 'next/link';
import { SurrealSignout } from '../../../lib/Surreal';
import { ButtonSmall } from '../../Button';
import NavbarIconDropdown from './IconDropdown';
import { useTranslation } from 'react-i18next';

export default function AppLayoutNavbar() {
    const authenticated = useIsAuthenticated();
    const { t } = useTranslation('components');

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
                        <Link href="/account">
                            {t('layout.app.navbar.account')}
                        </Link>
                        <a href="#" onClick={Signout}>
                            {t('layout.app.navbar.signout')}
                        </a>
                    </NavbarIconDropdown>
                ) : (
                    <>
                        <Link href="/auth/signin">
                            <ButtonSmall
                                text={t('layout.app.navbar.signin') as string}
                            />
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}