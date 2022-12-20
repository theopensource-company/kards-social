import React from 'react';
import styles from '../styles/components/Toggle.module.scss';

export function Toggle({
    on,
    set,
}: {
    on: boolean;
    set: (state: boolean) => void;
}) {
    return (
        <div
            onClick={() => set(!on)}
            className={[styles.toggle, on ? styles.toggleOn : ''].join(' ')}
        >
            <div>
                <div>
                    <div />
                </div>
            </div>
        </div>
    );
}
