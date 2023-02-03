import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ButtonLarge } from '../../components/Button';
import { toast } from 'react-toastify';

import styles from '../../styles/pages/Auth/ResetPassword.module.scss';
import Logo from '../../components/Logo';
import { FormInputField } from '../../components/Form/InputField';
import { SurrealQuery } from '../../lib/Surreal';
import { useTranslation } from 'react-i18next';
import { FieldErrors, useForm } from 'react-hook-form';
import { Icon, Send, Check, Save } from 'react-feather';
import { UpdateUnauthenticatedUserPassword } from '../../lib/KardsUser';
import usePasswordValidator from '../../hooks/FieldValidation/password';

type TPreVerifiedForm = {
    email: string;
};

type TPostVerifiedForm = {
    newpassword: string;
    verifypassword: string;
};

export default function JoinWaitlist() {
    const router = useRouter();
    const { email, secret, success } = router.query;
    const [ActiveIcon, setIcon] = useState<Icon | false>(Send);
    const preVerifiedForm = useForm<TPreVerifiedForm>();
    const postVerifiedForm = useForm<TPostVerifiedForm>();
    const { t } = useTranslation('pages');
    const { isValidPassword } = usePasswordValidator();

    const onSuccessPreVerified = async (values: TPreVerifiedForm) => {
        (async () => {
            setIcon(false);
            try {
                const result = await SurrealQuery<{
                    id: `email_verification:${string}`;
                    email: `${string}@${string}.${string}`;
                    recipient: string;
                    template: 'reset_password';
                }>(
                    `CREATE email_verification CONTENT ${JSON.stringify({
                        email: values.email,
                        recipient: values.email, // Just put something random here, is not used for this scenario
                        template: 'reset_password',
                        origin: location.origin,
                    })}`
                );

                if (!result[0].result || !result[0].result[0])
                    return toast.error(
                        t('common:errors.generic', {
                            code: 'ERRNORS', // Error NO ReSponse
                        })
                    );
                if (result[0].result[0].email !== values.email)
                    return toast.error(
                        t('common:errors.generic', {
                            code: 'ERRIVRS', // Error InValid ReSponse
                        })
                    );

                toast.success(
                    t('auth.reset-password.pre-verified.submitted.success')
                );
                return true;
            } catch (e) {
                toast.error(
                    t('common:errors.generic', {
                        code: 'ERRNNWR', // Error No NetWork Response
                    })
                );
            }
        })().then((success) => {
            if (success === true) {
                setIcon(Check);
                setTimeout(() => setIcon(Send), 1000);
            } else {
                setIcon(Send);
            }
        });
    };

    const onFailurePreVerified = (faulty: FieldErrors<TPreVerifiedForm>) => {
        if (faulty.email)
            toast.error(
                t('auth.reset-password.pre-verified.fields.email.faulty')
            );
    };

    const onSuccessPostVerified = async (values: TPostVerifiedForm) => {
        if (!email || !secret) return;

        (async () => {
            setIcon(false);

            if (!isValidPassword(values)) return;

            const result = await UpdateUnauthenticatedUserPassword({
                email: typeof email == 'object' ? email[0] : email,
                secret: typeof secret == 'object' ? secret[0] : secret,
                newpassword: values.newpassword,
            });

            if (!result) return false && toast.error('Network request failed');

            if (!result.credentials_correct)
                return false && toast.error('Link expired');

            if (!result.replacement_valid)
                return (
                    false &&
                    toast.error(
                        t(
                            'auth.reset-password.post-verified.submitted.error-criteria-not-met'
                        )
                    )
                );

            toast.success(
                t('auth.reset-password.post-verified.submitted.success')
            );
            router.push('/auth/signin');
            return true;
        })().then(() => setIcon(Send));
    };

    const onFailurePostVerified = async (
        faulty: FieldErrors<TPostVerifiedForm>
    ) => {
        if (faulty.newpassword)
            toast.error(
                t('auth.reset-password.post-verified.fields.newpassword.faulty')
            );
    };

    if ((email && secret) || success !== undefined) {
        return (
            <div className={styles.container}>
                <form
                    className={styles.form}
                    onSubmit={postVerifiedForm.handleSubmit(
                        onSuccessPostVerified,
                        onFailurePostVerified
                    )}
                >
                    <Logo />
                    <div className={styles.inputs}>
                        <FormInputField
                            placeholder={
                                t(
                                    'auth.reset-password.post-verified.fields.newpassword.placeholder'
                                ) as string
                            }
                            type="password"
                            {...postVerifiedForm.register('newpassword', {
                                validate: (v) => v && v !== '',
                            })}
                        />
                        <FormInputField
                            placeholder={
                                t(
                                    'auth.reset-password.post-verified.fields.verifypassword.placeholder'
                                ) as string
                            }
                            type="password"
                            {...postVerifiedForm.register('verifypassword')}
                        />
                    </div>
                    <ButtonLarge
                        text={
                            t(
                                'auth.reset-password.post-verified.submitted.button'
                            ) as string
                        }
                        icon={ActiveIcon && <Save size={22} />}
                        loading={!ActiveIcon}
                        disabled={!ActiveIcon}
                    />
                </form>
            </div>
        );
    } else {
        return (
            <div className={styles.container}>
                <form
                    className={styles.form}
                    onSubmit={preVerifiedForm.handleSubmit(
                        onSuccessPreVerified,
                        onFailurePreVerified
                    )}
                >
                    <Logo />
                    <div className={styles.inputs}>
                        <FormInputField
                            placeholder={
                                t(
                                    'auth.reset-password.pre-verified.fields.email.placeholder'
                                ) as string
                            }
                            type="email"
                            {...preVerifiedForm.register('email', {
                                validate: (v) =>
                                    v &&
                                    /^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i.test(
                                        v
                                    ),
                            })}
                        />
                    </div>
                    <ButtonLarge
                        text={
                            t(
                                'auth.reset-password.pre-verified.submitted.button'
                            ) as string
                        }
                        icon={ActiveIcon && <ActiveIcon size={22} />}
                        loading={!ActiveIcon}
                        disabled={!ActiveIcon}
                    />
                </form>
            </div>
        );
    }
}

// JoinWaitlist.hideNavbar = true;
