import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AccountSidebarItems } from '../../../constants/AccountSidebar';

import { TPageLayoutAccount } from '../../../constants/Types/Page.types';
import { useAuthenticatedKardsUser } from '../../../hooks/Queries/Auth';
import styles from '../../../styles/components/layout/Account.module.scss';
import SidebarItem from './SidebarItem';

export default function AccountLayout({
    children,
    activeKey,
}: TPageLayoutAccount) {
    const { t } = useTranslation('components');
    const { data: user, isLoading: isUserLoading } =
        useAuthenticatedKardsUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && !user) {
            toast.info(t('layout.account.error-unauthenticated'));
            router.push('/auth/signin');
        }
    }, [isUserLoading, user, router, t]);

    return (
        <>
            {user && (
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
