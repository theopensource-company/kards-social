import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

import styles from '../../styles/pages/JoinWaitlist.module.scss';
import Logo from '../../components/Logo';
import { FormInputField } from '../../components/Form/InputField';
import { SurrealSignin } from '../../lib/Surreal';
import {
    useDelayedRefreshAuthenticatedUser,
    useIsAuthenticated,
} from '../../hooks/KardsUser';
import AppLayout from '../../components/Layout/App';
import { useTranslation } from 'react-i18next';
import { useForm, FieldErrors } from 'react-hook-form';

type TSigninFields = {
    identifier: string;
    password: string;
};

export default function Signin() {
    const router = useRouter();
    const [working, setWorking] = useState(false);
    const authenticated = useIsAuthenticated();
    const refreshUserDetails = useDelayedRefreshAuthenticatedUser();
    const { register, handleSubmit } = useForm<TSigninFields>();
    const { t } = useTranslation('pages');

    useEffect(() => {
        if (authenticated) router.push('/account');
    }, [authenticated, router]);

    const onSuccess = async (values: TSigninFields) => {
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

    const onFailure = async (faulty: FieldErrors<TSigninFields>) => {
        if (faulty.identifier)
            toast.error(t('auth.signin.submitted.faulty-identifier'));
        if (faulty.password)
            toast.error(t('auth.signin.submitted.faulty-password'));
    };

    return (
        <AppLayout>
            <form onSubmit={handleSubmit(onSuccess, onFailure)}>
                <Logo />
                <div className={styles.inputs}>
                    <FormInputField
                        {...register('identifier', {
                            validate: (v) => v && v !== '',
                        })}
                        placeholder={
                            t('auth.signin.input-identifier') as string
                        }
                    />
                    <FormInputField
                        {...register('password', {
                            validate: (v) => v && v !== '',
                        })}
                        type="password"
                        placeholder={t('auth.signin.input-password') as string}
                    />
                </div>
                <Button
                    text={t('auth.signin.button') as string}
                    loading={working}
                />
            </form>
        </AppLayout>
    );
}
