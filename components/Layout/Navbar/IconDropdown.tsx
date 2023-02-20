import React, { ReactNode, useState } from 'react';
import * as Feather from 'react-feather';
import styles from '../../../styles/components/layout/App/NavbarIconDropdown.module.scss';
import NavbarDropdownRenderer from './DropdownRenderer';

export default function NavbarIconDropdown({
    icon,
    children,
}: {
    icon: keyof typeof Feather;
    children: ReactNode;
}) {
    const [open, setOpen] = useState<boolean>(false);
    const { ChevronDown, [icon]: ChosenIcon } = Feather;
    return (
        <NavbarDropdownRenderer
            clickable={
                <div className={styles.iconDropdown}>
                    <ChevronDown
                        size={20}
                        className={`${styles.arrow} ${
                            open ? styles.rotateArrow : ''
                        }`}
                    />
                    <div
                        className={`${styles.iconButton} ${
                            open ? styles.iconButtonActive : ''
                        }`}
                    >
                        <ChosenIcon />
                    </div>
                </div>
            }
            {...{
                children,
                open,
                setOpen,
            }}
        />
    );
}
