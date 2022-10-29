import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

import styles from '../../styles/JoinWaitlist.module.scss';
import Logo from '../../components/Logo';
import { Form } from '../../components/Form';
import { FormInputField } from '../../components/Form/InputField';
import { TForm } from '../../constants/Types';
import { SurrealSignin } from '../../lib/Surreal';
import { useDelayedRefreshAuthenticatedUser, useIsAuthenticated } from '../../hooks/KardsUser';
import AppLayout from '../../components/Layout/App';

export default function Signin() {
    const router = useRouter();
    const [working, setWorking] = useState(false);
    const authenticated = useIsAuthenticated();
    const refreshUserDetails = useDelayedRefreshAuthenticatedUser();
    
    useEffect(() => {
        if (authenticated) router.push('/account');
    }, [authenticated]);

    const submitForm: TForm['onSubmit'] = async ({ values, faulty }) => {
        if (faulty.identifier)
            toast.error('Please enter your username or email');
        if (faulty.password) toast.error('Please enter your password');
        if (Object.keys(faulty).length > 0) return;

        setWorking(true);

        SurrealSignin({
            identifier: values.identifier,
            password: values.password
        }).then(authenticated => {
            if (authenticated) {
                refreshUserDetails();
            } else {
                toast.error(
                    `Your username/email or password is incorrect.`
                );
            }
        }).finally(() => setWorking(false));
    };

    const inputIdentifier = new FormInputField({
        name: 'identifier',
        placeholder: 'Username or email',
        isValid: (value) => value != '',
    });

    const inputPassword = new FormInputField({
        name: 'password',
        placeholder: 'Password',
        type: 'Password',
        isValid: (value) => value != '',
    });

    return (
        <AppLayout>
            <Form
                className={styles.form}
                inputs={[inputIdentifier, inputPassword]}
                onSubmit={submitForm}
            >
                <Logo />
                <div className={styles.inputs}>
                    <inputIdentifier.render />
                    <inputPassword.render />
                </div>
                <Button text="Signin" loading={working} />
            </Form>
        </AppLayout>
    );
}
