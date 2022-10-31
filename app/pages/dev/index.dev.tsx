import Link from "next/link";
import React from "react";
import fs from 'fs';

export async function getStaticProps() {
    return {
        props: {
            routes: fs.readdirSync('pages/dev')
                .map(a => a.split('.')[0])
                .filter(a => a !== 'index')
                .sort((a, b) => a.localeCompare(b))
                .reduce((prev: {
                    [key: string]: string[]
                }, curr: string) => {
                    const letter: string = curr[0].toLowerCase();
                    return {
                        ...prev,
                        [letter]: [
                            ...prev[letter] ?? [],
                            curr
                        ]
                    };
                }, {})
        }
    }
}



export default function Page({
    routes
}: {
    routes: {
        [key: string]: string[]
    }
}) {
    return (
        <div style={{
            padding: '50px',
            fontSize: '20px'
        }}>
            <Link href="/">
                back to home
            </Link>
            <br />
            {
                Object.keys(routes).map(letter => {
                    return (
                        <div key={letter}>
                            <h2>
                                {letter.toUpperCase()}
                            </h2>
                            <ul>
                                {
                                    routes[letter].map(r => (
                                        <li key={r}>
                                            <Link href={`/dev/${r}`} style={{
                                                fontSize: '18px'
                                            }}>
                                                {r[0].toUpperCase()}{r.slice(1)}
                                            </Link>
                                        </li>
                                    ))
                                }
                            </ul>

                            <br />
                        </div>
                    )
                })
            }
        </div>
    )
}