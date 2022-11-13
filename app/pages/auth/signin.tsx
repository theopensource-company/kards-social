import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

import styles from '../../styles/pages/JoinWaitlist.module.scss';
import Logo from '../../components/Logo';
import { Form } from '../../components/Form';
import { FormInputField } from '../../components/Form/InputField';
import { TForm } from '../../constants/Types';
import { SurrealSignin } from '../../lib/Surreal';
import {
    useDelayedRefreshAuthenticatedUser,
    useIsAuthenticated,
} from '../../hooks/KardsUser';
import AppLayout from '../../components/Layout/App';
import { useTranslation } from 'react-i18next';

export default function Signin() {
    const router = useRouter();
    const [working, setWorking] = useState(false);
    const authenticated = useIsAuthenticated();
    const refreshUserDetails = useDelayedRefreshAuthenticatedUser();
    const { t } = useTranslation('pages');

    useEffect(() => {
        if (authenticated) router.push('/account');
    }, [authenticated, router]);

    const submitForm: TForm['onSubmit'] = async ({ values, faulty }) => {
        if (faulty.identifier)
            toast.error(t('auth.signin.submitted.faulty-identifier'));
        if (faulty.password)
            toast.error(t('auth.signin.submitted.faulty-password'));
        if (Object.keys(faulty).length > 0) return;

        setWorking(true);

        SurrealSignin({
            identifier: values.identifier,
            password: values.password,
        })
            .then((authenticated) => {
                if (authenticated) {
                    refreshUserDetails();
                } else {
                    toast.error(t('auth.signin.submitted.invalid-credentials'));
                }
            })
            .finally(() => setWorking(false));
    };

    const inputIdentifier = new FormInputField({
        name: 'identifier',
        placeholder: t('auth.signin.input-identifier') as string,
        isValid: (value) => value != '',
    });

    const inputPassword = new FormInputField({
        name: 'password',
        placeholder: t('auth.signin.input-password') as string,
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
                <Button
                    text={t('auth.signin.button') as string}
                    loading={working}
                />
            </Form>
        </AppLayout>
    );
}
