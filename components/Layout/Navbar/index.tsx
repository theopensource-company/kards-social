import Link from 'next/link';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useIsAuthenticated } from '../../../hooks/KardsUser';
import { SurrealSignout } from '../../../lib/Surreal';
import styles from '../../../styles/components/layout/App/Navbar.module.scss';
import { ButtonSmall } from '../../Button';
import ProfilePicture from '../../Common/ProfilePicture';
import { LogoSmall } from '../../Logo';
import SigninModal from '../../Modal/Variants/SigninModal';
import NavbarImageDropdown from './ImageDropdown';

export default function AppLayoutNavbar() {
    const authenticated = useIsAuthenticated();
    const [showSignin, setShowSignin] = useState<boolean>(false);
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

    const OpenSignin = () => {
        setShowSignin(true);
    };
    const CloseSignin = () => {
        setShowSignin(false);
        console.log('close');
    };

    return (
        <div className={styles.navbar}>
            <Link href="/">
                <LogoSmall className={styles.logo} />
            </Link>
            <div>
                {authenticated ? (
                    <NavbarImageDropdown
                        image={ProfilePicture({ rounded: false })}
                    >
                        <Link href="/account">
                            {t('layout.app.navbar.account')}
                        </Link>
                        <a href="#" onClick={Signout}>
                            {t('layout.app.navbar.signout')}
                        </a>
                    </NavbarImageDropdown>
                ) : (
                    <>
                        <ButtonSmall
                            text={t('layout.app.navbar.signin') as string}
                            onClick={OpenSignin}
                        />
                    </>
                )}
            </div>
            <SigninModal show={showSignin} onClose={CloseSignin} />
        </div>
    );
}
