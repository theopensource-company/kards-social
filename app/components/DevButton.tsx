import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useFeatureFlag } from '../hooks/Environment';

export function DevButton() {
    const router = useRouter();
    const show = useFeatureFlag('devTools');
    const [showDevTools, setShowDevTools] = useState<boolean>(false);

    useEffect(() => {
        setShowDevTools(show);
    }, [show]);

    return (
        <>
            {showDevTools &&
                !router.pathname.startsWith('/dev') &&
                !router.pathname.startsWith('/admin') && (
                    <div
                        style={{
                            position: 'absolute',
                            margin: '15px',
                            padding: '5px 10px',
                            backgroundColor: 'red',
                            color: 'white',
                            borderRadius: '3px',
                            right: 0,
                            display: 'flex',
                            gap: '10px',
                        }}
                    >
                        <Link href="/dev">Devtools</Link>
                        <span>-</span>
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setShowDevTools(false);
                            }}
                        >
                            Hide
                        </a>
                    </div>
                )}
        </>
    );
}
