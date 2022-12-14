import React, { createRef, useEffect } from 'react';
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
    const modalContainerRef = createRef<HTMLDivElement>();

    //props: https://stackoverflow.com/a/42234988
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                show &&
                event.target &&
                modalContainerRef.current &&
                !modalContainerRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        }

        function handleEscapeKey(event: KeyboardEvent) {
            if (show && event.key == 'Escape') {
                onClose();
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keyup', handleEscapeKey);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keyup', handleEscapeKey);
        };
    }, [modalContainerRef, onClose, show]);

    const classes = [styles.default, show ? styles.show : null]
        .filter((a) => !!a)
        .join(' ');

    const containerClasses = [
        styles.container,
        show ? styles.showContainer : null,
    ]
        .filter((a) => !!a)
        .join(' ');

    const { t } = useTranslation('components');
    const { X } = Feather;

    return (
        <div className={classes}>
            <div className={containerClasses} ref={modalContainerRef}>
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
