import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    useAuthenticatedKardsUser,
    useSignout,
} from '../../../hooks/Queries/Auth';
import styles from '../../../styles/components/layout/App/Navbar.module.scss';
import { ButtonSmall } from '../../Button';
import ProfilePicture from '../../Common/ProfilePicture';
import { LogoSmall } from '../../Logo';
import SigninModal from '../../Modal/Variants/SigninModal';
import NavbarImageDropdown from './ImageDropdown';

export default function AppLayoutNavbar() {
    const { data: authenticatedUser, refetch: refetchAuthenticatedUser } =
        useAuthenticatedKardsUser();
    const [showSignin, setShowSignin] = useState<boolean>(false);
    const { mutate: signout, data: signoutSuccess } = useSignout();
    const { t } = useTranslation('components');

    useEffect(() => {
        refetchAuthenticatedUser();
    }, [signoutSuccess, refetchAuthenticatedUser]);

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
                {authenticatedUser ? (
                    <NavbarImageDropdown
                        image={<ProfilePicture rounded={false} />}
                    >
                        <Link href="/account">
                            {t('layout.app.navbar.account')}
                        </Link>
                        <a href="#" onClick={() => signout()}>
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
