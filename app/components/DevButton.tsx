import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function DevButton() {
    const router = useRouter();
    const [showDevTools, setShowDevTools] = useState<boolean>(
        process.env.NEXT_PUBLIC_ENV == 'dev' &&
            process.env.NEXT_PUBLIC_DEPLOYMENT_STATUS != 'deployed'
    );

    return (
        <>
            {showDevTools && !router.pathname.startsWith('/dev') && (
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
