import Link from 'next/link';
import React from 'react';

export default function DevLayout({
    children,
    home,
}: {
    children: React.ReactNode;
    home?: boolean;
}) {
    return (
        <div
            style={{
                padding: '50px',
                fontSize: '20px',
            }}
        >
            {home ? (
                <Link href="/">back to home</Link>
            ) : (
                <Link href="/dev">back to devtools</Link>
            )}
            <br />
            {children}
        </div>
    );
}
