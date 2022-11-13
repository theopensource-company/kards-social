import React from 'react';
import AppLayout from '../App';
import { TPageLayoutAccount } from '../../../constants/Types';
import styles from '../../../styles/components/layout/Account.module.scss';
import SidebarItem from './SidebarItem';
import { AccountSidebarItems } from '../../../constants/AccountSidebar';
import { useTranslation } from 'react-i18next';

export default function AccountLayout({
    children,
    activeKey,
    ...props
}: TPageLayoutAccount) {
    const { t } = useTranslation('components');

    return (
        <AppLayout {...props}>
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
        </AppLayout>
    );
}
