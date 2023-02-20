import React, { ReactNode, useState } from 'react';
import NavbarDropdownRenderer from './DropdownRenderer';
import * as Feather from 'react-feather';
import styles from '../../../styles/components/layout/App/NavbarIconDropdown.module.scss';

export default function NavbarImageDropdown({
    image,
    children,
}: {
    image: ReactNode;
    children: ReactNode;
}) {
    const [open, setOpen] = useState<boolean>(false);
    const { ChevronDown } = Feather;
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
                        {image}
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
