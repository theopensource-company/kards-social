import { useEffect } from 'react';

export function getStaticProps() {
    return {
        props: {
            notFound: process.env.NODE_ENV === 'production',
        },
    };
}

export default function Page() {
    useEffect(() => {
        location.href = '/admin';
    }, []);
    return;
}
