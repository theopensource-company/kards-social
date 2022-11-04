import { useEffect } from 'react';

export default function Page() {
    useEffect(() => {
        location.href = '/admin';
    }, []);
    return;
}
