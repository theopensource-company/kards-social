import React, { useState } from 'react';
import { Check, Icon, LogIn } from 'react-feather';
import { FieldErrors, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Modal from '..';
import { useDelayedRefreshAuthenticatedUser } from '../../../hooks/KardsUser';
import { SurrealSignin } from '../../../lib/Surreal';
import Button from '../../Button';
import { FormInputField } from '../../Form/InputField';

import styles from '../../../styles/components/modal/Signin.module.scss';

type Props = {
    show: boolean;
    onClose: () => void;
};

type TSigninFields = {
    identifier: string;
    password: string;
};

export default function SigninModal({ show, onClose }: Props) {
    const [ActiveIcon, setIcon] = useState<Icon | false>(LogIn);
    const refreshUserDetails = useDelayedRefreshAuthenticatedUser();
    const { register, handleSubmit } = useForm<TSigninFields>();
    const { t } = useTranslation('pages');

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
                    setTimeout(() => {
                        setIcon(LogIn);
                        onClose();
                    }, 1000);
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
        <Modal title="Log In" show={show} onClose={onClose}>
            <form
                className={styles.form}
                onSubmit={handleSubmit(onSuccess, onFailure)}
            >
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
                    color="Tint"
                    text={t('auth.signin.button') as string}
                    icon={ActiveIcon && <ActiveIcon size={22} />}
                    loading={!ActiveIcon}
                    disabled={!ActiveIcon}
                />
            </form>
        </Modal>
    );
}
