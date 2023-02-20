import React, { createRef, useCallback, useState } from 'react';
import { SurrealInstance } from '../../lib/Surreal';
import DevLayout from './_layout';

export function getStaticProps() {
    return {
        props: {
            notFound: process.env.NODE_ENV === 'production',
        },
    };
}

export default function Page() {
    const inputRef = createRef<HTMLInputElement>();
    const [result, setResult] = useState<object>({});

    const run = useCallback(() => {
        if (inputRef.current && inputRef.current.value.length > 0) {
            SurrealInstance.opiniatedQuery(inputRef.current.value).then(
                (res) => {
                    setResult(res);
                }
            );
        } else {
            alert('No query');
        }
    }, [inputRef, setResult]);

    return (
        <DevLayout>
            <p>Queries are ran as the currently signed in user.</p>
            <input
                placeholder="query"
                ref={inputRef}
                onKeyDown={(e) => {
                    if (e.code == 'Enter') run();
                }}
                style={{
                    padding: '10px',
                    width: '400px',
                    fontSize: '20px',
                }}
            />
            <button
                onClick={run}
                style={{
                    padding: '10px',
                    width: '80px',
                    marginLeft: '20px',
                    fontSize: '20px',
                }}
            >
                run
            </button>

            <p
                style={{
                    whiteSpace: 'pre',
                    fontFamily: "'Courier New', monospace",
                    background: '#333',
                    marginTop: '30px',
                    padding: '40px 30px',
                    maxWidth: '1000px',
                }}
            >
                {JSON.stringify(result, null, 2)}
            </p>
        </DevLayout>
    );
}
