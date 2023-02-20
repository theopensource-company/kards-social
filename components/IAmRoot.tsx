import React, { useEffect, useState } from 'react';

import { useFeatureFlags } from '../hooks/Environment';
import styles from '../styles/components/IAmRoot.module.scss';
import Button from './Button';
import Modal from './Modal';
import { Toggle } from './Toggle';

export function IAmRoot() {
    const fflags = useFeatureFlags();
    const [show, setShow] = useState<boolean>(false);
    const [updates, setUpdates] = useState(fflags);

    useEffect(() => {
        setUpdates(fflags);
    }, [fflags]);

    useEffect(() => {
        let hot = false;
        let secret = '';
        const onKeyStroke = function (e: KeyboardEvent) {
            if (e.key == 'Escape') {
                if (hot && secret == 'iamroot') {
                    hot = false;
                    secret = '';
                    setShow(true);
                } else {
                    hot = true;
                }

                return;
            }

            if (hot && !e.code.startsWith(e.key)) {
                secret += e.key;
                if ('iamroot'.startsWith(secret)) return;
            }

            hot = false;
            secret = '';
        };

        document.addEventListener('keyup', onKeyStroke);
        return () => document.removeEventListener('keyup', onKeyStroke);
    }, [setShow]);

    return (
        <Modal title="Feature flags" show={show} onClose={() => setShow(false)}>
            <div className={styles.fflags}>
                {Object.keys(updates).map((fflag) => (
                    <div className={styles.option} key={fflag}>
                        <h4>{fflag}</h4>
                        <Toggle
                            on={updates[fflag as keyof typeof updates]}
                            set={(state) =>
                                setUpdates({
                                    ...updates,
                                    [fflag]: state,
                                })
                            }
                        />
                    </div>
                ))}
            </div>

            <Button
                text="Save & reload"
                onClick={() => {
                    localStorage.setItem('kfflags', JSON.stringify(updates));
                    location.reload();
                }}
            />
        </Modal>
    );
}
