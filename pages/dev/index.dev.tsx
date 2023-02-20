import fs from 'fs';
import Link from 'next/link';
import React from 'react';
import DevLayout from './_layout';

export async function getStaticProps() {
    if (process.env.NODE_ENV == 'production')
        return {
            props: {
                notFound: true,
            },
        };

    return {
        props: {
            routes: fs
                .readdirSync('pages/dev')
                .map((a) => a.split('.')[0])
                .filter((a) => a !== 'index' && !a.startsWith('_'))
                .sort((a, b) => a.localeCompare(b))
                .reduce(
                    (
                        prev: {
                            [key: string]: string[];
                        },
                        curr: string
                    ) => {
                        const letter: string = curr[0].toLowerCase();
                        return {
                            ...prev,
                            [letter]: [...(prev[letter] ?? []), curr],
                        };
                    },
                    {}
                ),
        },
    };
}

export default function Page({
    routes,
}: {
    routes: {
        [key: string]: string[];
    };
}) {
    return (
        <DevLayout home>
            {Object.keys(routes).map((letter) => {
                return (
                    <div key={letter}>
                        <h2>{letter.toUpperCase()}</h2>
                        <ul>
                            {routes[letter].map((r) => (
                                <li key={r}>
                                    <Link
                                        href={`/dev/${r}`}
                                        style={{
                                            fontSize: '18px',
                                        }}
                                    >
                                        {r[0].toUpperCase()}
                                        {r.slice(1).replace('-', ' ')}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <br />
                    </div>
                );
            })}
        </DevLayout>
    );
}
