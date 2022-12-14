import React from 'react';
import * as Feather from 'react-feather';
import { useTranslation } from 'react-i18next';

import styles from '../../styles/components/Modal.module.scss';
import { ButtonSmall } from '../Button';

type Props = {
    show: boolean;
    title: string | undefined;
    children: React.ReactNode;
    onClose: () => void;
};

export default function Modal({ show, title, children, onClose }: Props) {
    const classes = [styles.default, show ? styles.show : null]
        .filter((a) => !!a)
        .join(' ');

    const { t } = useTranslation('components');

    const { X } = Feather;

    return (
        <div className={classes}>
            <div className={styles.container}>
                <div className={styles.top}>
                    <h1>{title}</h1>
                    <ButtonSmall
                        color="Transparent"
                        icon={<X />}
                        iconAlt={t('layout.modals.close') as string}
                        onClick={() => {
                            onClose();
                        }}
                        disabled={!onClose}
                    />
                </div>
                {children}
            </div>
        </div>
    );
}
