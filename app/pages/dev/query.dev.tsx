import Link from 'next/link';
import React, { createRef, useCallback, useState } from 'react';
import { SurrealQuery } from '../../lib/Surreal';

export default function Page() {
    const inputRef = createRef<HTMLInputElement>();
    const [result, setResult] = useState<object>({});

    const run = useCallback(() => {
        if (inputRef.current && inputRef.current.value.length > 0) {
            SurrealQuery(inputRef.current.value).then((res) => {
                setResult(res);
            });
        } else {
            alert('No query');
        }
    }, [inputRef, setResult]);

    return (
        <div
            style={{
                padding: '50px',
                fontSize: '20px',
            }}
        >
            <Link href="/dev">back to devtools</Link>
            <br />
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
        </div>
    );
}
