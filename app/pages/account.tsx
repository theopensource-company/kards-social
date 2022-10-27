import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import ArrowBack from '../components/icon/ArrowBack';
import { toast } from 'react-toastify';

import styles from '../styles/JoinWaitlist.module.scss';
import LayoutContentMiddle from '../components/Layout/ContentMiddle';
import { useUserDetails } from '../hooks/KardsUser';
import Spinner from '../components/icon/Spinner';
import { SurrealQuery } from '../lib/Surreal';

export default function Account() {
    const router = useRouter();

    const {isReady, result: user} = useUserDetails();

    useEffect(() => {
        if (isReady && !user) {
            toast.info('Please signin first!');
            router.push('/auth/signin');
        }
    }, [isReady, user]);

    return (
        <LayoutContentMiddle>
            {isReady ? (
                <>
                    <div className={styles.back}>
                        <Button
                            text="Back"
                            icon={<ArrowBack />}
                            size="Small"
                            onClick={() => router.push('/')}
                        />
                    </div>
                    {user && (
                        <div>
                            <h1>{user.name}</h1>
                            <p>@{user.username}</p>
                            <p>{user.email}</p>
                            <input defaultValue={user.name} onBlur={(e) => {
                                const query = 'UPDATE user SET name="' + e.target.value + '"';
                                console.log(query);
                                
                                SurrealQuery(query, {
                                    name: e.target.value
                                });
                            }} />
                        </div>
                        
                    )}
                    
                </>
            ) : (
                <Spinner color="Light" size={50} />
            )}
        </LayoutContentMiddle>
    );
}
