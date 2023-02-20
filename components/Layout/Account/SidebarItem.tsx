import Link from 'next/link';
import React from 'react';
import * as Feather from 'react-feather';
import { TAccountSidebarItem } from '../../../constants/Types';
import styles from '../../../styles/components/layout/Account.module.scss';

export default function AccountLayoutSidebarItem({
    icon,
    title,
    description,
    active,
    link,
}: TAccountSidebarItem) {
    const Icon = Feather[icon];

    return (
        <Link
            href={link}
            className={[
                styles.sidebarItem,
                active ? styles.sidebarItemActive : null,
            ]
                .filter((a) => !!a)
                .join(' ')}
        >
            <div className={styles.sidebarItemIcon}>
                <Icon size={30} />
            </div>
            <h3 className={styles.sidebarItemTitle}>{title}</h3>
            <p className={styles.sidebarItemDescription}>{description}</p>
        </Link>
    );
}
