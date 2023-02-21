import { useRouter } from 'next/router';
import React, { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '../../components/Button';

import { Check, LogIn } from 'react-feather';
import { FieldErrors, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { FormInputField } from '../../components/Form/InputField';
import Logo from '../../components/Logo';
import { TAuthenticateKardsUser } from '../../constants/Types/KardsUser.types';
import { useAuthenticatedKardsUser, useSignin } from '../../hooks/Queries/Auth';
import styles from '../../styles/pages/Auth/Signin.module.scss';

export default function Signin() {
    const router = useRouter();
    const { t } = useTranslation('pages');
    const { register, handleSubmit } = useForm<TAuthenticateKardsUser>();
    const { mutate: signin, data: success, isLoading } = useSignin();
    const { data: authenticatedUser, refetch: refetchAuthenticatedUser } =
        useAuthenticatedKardsUser();
    const ActiveIcon = success ? Check : LogIn;

    const navigateAway = useCallback(() => {
        const followup = Array.isArray(router.query?.followup)
            ? router.query?.followup[0]
            : router.query?.followup;
        router.push(followup ?? '/account');
    }, [router]);

    useEffect(() => {
        if (authenticatedUser) navigateAway();
    }, [authenticatedUser, navigateAway]);

    useEffect(() => {
        refetchAuthenticatedUser();
    }, [success, refetchAuthenticatedUser]);

    const onFailure = async (faulty: FieldErrors<TAuthenticateKardsUser>) => {
        if (faulty.identifier)
            toast.error(t('auth.signin.submitted.faulty-identifier'));
        if (faulty.password)
            toast.error(t('auth.signin.submitted.faulty-password'));
    };

    return (
        <div className={styles.container}>
            <form
                className={styles.form}
                onSubmit={handleSubmit((v) => signin(v), onFailure)}
            >
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
                    icon={<ActiveIcon size={22} />}
                    loading={isLoading}
                    disabled={isLoading}
                />
            </form>
        </div>
    );
}
