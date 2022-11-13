import React, { useEffect } from 'react';
import AppLayout from '../App';
import { TPageLayoutAccount } from '../../../constants/Types';
import styles from '../../../styles/components/layout/Account.module.scss';
import SidebarItem from './SidebarItem';
import { AccountSidebarItems } from '../../../constants/AccountSidebar';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useAuthState } from '../../../hooks/KardsUser';

export default function AccountLayout({
    children,
    activeKey,
    ...props
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
        <AppLayout {...props}>
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
        </AppLayout>
    );
}
