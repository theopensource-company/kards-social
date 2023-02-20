import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../../components/Button';
import { toast } from 'react-toastify';

import styles from '../../styles/pages/Auth/Signin.module.scss';
import Logo from '../../components/Logo';
import { FormInputField } from '../../components/Form/InputField';
import { SurrealSignin } from '../../lib/Surreal';
import {
    useDelayedRefreshAuthenticatedUser,
    useIsAuthenticated,
} from '../../hooks/KardsUser';
import { useTranslation } from 'react-i18next';
import { useForm, FieldErrors } from 'react-hook-form';
import { Check, Icon, LogIn } from 'react-feather';

type TSigninFields = {
    identifier: string;
    password: string;
};

export default function Signin() {
    const router = useRouter();
    const [ActiveIcon, setIcon] = useState<Icon | false>(LogIn);
    const authenticated = useIsAuthenticated();
    const refreshUserDetails = useDelayedRefreshAuthenticatedUser();
    const { register, handleSubmit } = useForm<TSigninFields>();
    const { t } = useTranslation('pages');

    useEffect(() => {
        if (authenticated) router.push('/account');
    }, [authenticated, router]);

    const onSuccess = async (values: TSigninFields) => {
        setIcon(false);

        SurrealSignin({
            identifier: values.identifier,
            password: values.password,
        })
            .then((authenticated) => {
                if (authenticated) {
                    refreshUserDetails();
                    setIcon(Check);
                    setTimeout(() => setIcon(LogIn), 1000);
                } else {
                    toast.error(t('auth.signin.submitted.invalid-credentials'));
                    setIcon(LogIn);
                }
            })
            .catch(() => setIcon(LogIn));
    };

    const onFailure = async (faulty: FieldErrors<TSigninFields>) => {
        if (faulty.identifier)
            toast.error(t('auth.signin.submitted.faulty-identifier'));
        if (faulty.password)
            toast.error(t('auth.signin.submitted.faulty-password'));
    };

    return (
        <div className={styles.container}>
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSuccess, onFailure)}
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
                    icon={ActiveIcon && <ActiveIcon size={22} />}
                    loading={!ActiveIcon}
                    disabled={!ActiveIcon}
                />
            </form>
        </div>
    );
}
