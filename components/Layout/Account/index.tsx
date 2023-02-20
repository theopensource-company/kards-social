import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AccountSidebarItems } from '../../../constants/AccountSidebar';
import { TPageLayoutAccount } from '../../../constants/Types';
import { useAuthState } from '../../../hooks/KardsUser';
import styles from '../../../styles/components/layout/Account.module.scss';
import SidebarItem from './SidebarItem';

export default function AccountLayout({
    children,
    activeKey,
}: TPageLayoutAccount) {
    const { t } = useTranslation('components');
    const auth = useAuthState();
    const router = useRouter();

    useEffect(() => {
        if (!auth.authenticated) {
            toast.info(t('layout.account.error-unauthenticated'));
            router.push('/auth/signin');
        }
    }, [auth, router, t]);

    return (
        <>
            {auth.details && (
                <div className={styles.container}>
                    <div className={styles.sidebar}>
                        {AccountSidebarItems.map((item) => (
                            <SidebarItem
                                active={item.key == activeKey}
                                title={t(
                                    `layout.account.sidebar.${item.key}.title`
                                )}
                                description={t(
                                    `layout.account.sidebar.${item.key}.description`
                                )}
                                {...item}
                                key={item.key}
                            />
                        ))}
                    </div>
                    <div className={styles.content}>{children}</div>
                </div>
            )}
        </>
    );
}
