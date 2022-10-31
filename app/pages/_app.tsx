import React, { useState } from 'react';
import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Cross from '../components/icon/Cross';
import Info from '../components/icon/Info';
import '../hooks/Surreal'; //Initialize surrealdb instance
import { InitializeSurreal } from '../hooks/Surreal';
import { AuthProvider } from '../hooks/KardsUser';
import Link from 'next/link';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const [showDevTools, setShowDevTools] = useState<boolean>(process.env.NEXT_PUBLIC_ENV == 'dev'); 
    
    return (
        <InitializeSurreal>
            <AuthProvider>
                {showDevTools && !router.pathname.startsWith('/dev') && (
                    <div style={{
                        position: 'absolute',
                        margin: '15px',
                        padding: '5px 10px',
                        backgroundColor: 'red',
                        color: 'white',
                        borderRadius: '3px',
                        right: 0,
                        display: 'flex',
                        gap: '10px'
                    }}>
                        <Link href="/dev">
                            Devtools
                        </Link>
                        <span>-</span>
                        <a href="#" onClick={e => {e.preventDefault(); setShowDevTools(false)}}>
                            Hide
                        </a>
                    </div>
                )}
                <Component {...pageProps} />
                <ToastContainer
                    position="top-center"
                    closeButton={false}
                    icon={({ type }) => {
                        console.log(type);
                        return type == 'error' ? (
                            <Cross size={15} color="Light" />
                        ) : (
                            <Info
                                color={type == 'default' ? undefined : 'Light'}
                            />
                        );
                    }}
                />
            </AuthProvider>
        </InitializeSurreal>
    );
}

export default MyApp;
