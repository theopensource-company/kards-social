import React, { useEffect } from 'react';
import { Check, LogIn } from 'react-feather';
import { FieldErrors, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Modal from '..';
import Button from '../../Button';
import { FormInputField } from '../../Form/InputField';

import { TAuthenticateKardsUser } from '../../../constants/Types/KardsUser.types';
import {
    useAuthenticatedKardsUser,
    useSignin,
} from '../../../hooks/Queries/Auth';
import styles from '../../../styles/components/modal/Signin.module.scss';

type Props = {
    show: boolean;
    onClose: () => void;
};

export default function SigninModal({ show, onClose }: Props) {
    const { t } = useTranslation('pages');
    const { register, handleSubmit } = useForm<TAuthenticateKardsUser>();
    const { mutate: signin, data: success, isLoading } = useSignin();
    const { data: authenticatedUser, refetch: refetchAuthenticatedUser } =
        useAuthenticatedKardsUser();
    const ActiveIcon = success ? Check : LogIn;

    useEffect(() => {
        if (authenticatedUser) onClose();
    }, [authenticatedUser, onClose]);

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
        <Modal title="Log In" show={show} onClose={onClose}>
            <form
                className={styles.form}
                onSubmit={handleSubmit((v) => signin(v), onFailure)}
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
                    icon={<ActiveIcon size={22} />}
                    loading={isLoading}
                    disabled={isLoading}
                />
            </form>
        </Modal>
    );
}
