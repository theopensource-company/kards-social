import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ButtonLarge } from '../../components/Button';
import { toast } from 'react-toastify';

import styles from '../../styles/pages/JoinWaitlist.module.scss';
import Logo from '../../components/Logo';
import { FormInputField } from '../../components/Form/InputField';
import LayoutContentMiddle from '../../components/Layout/ContentMiddle';
import { SurrealQuery } from '../../lib/Surreal';
import { useTranslation } from 'react-i18next';
import { FieldErrors, useForm } from 'react-hook-form';
import { Check, Icon, Save, Send } from 'react-feather';
import { UpdateUnauthenticatedUserPassword } from '../../lib/KardsUser';

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
    const [ActiveIcon, setIcon] = useState<Icon | false>(
        email && secret ? false : Send
    );
    const preVerifiedForm = useForm<TPreVerifiedForm>();
    const postVerifiedForm = useForm<TPostVerifiedForm>();
    const { t } = useTranslation('pages');

    const onSuccessPreVerified = async (values: TPreVerifiedForm) => {
        (async () => {
            setIcon(false);
            try {
                const result = await SurrealQuery<{
                    id: `email_verification:${string}`;
                    email: `${string}@${string}.${string}`;
                    recipient: string;
                    template: 'waitlist';
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
                        t('waitlist.join.submitted.error', {
                            code: 'ERRNORS', // Error NO ReSponse
                        })
                    );
                if (result[0].result[0].email !== values.email)
                    return toast.error(
                        t('waitlist.join.submitted.error', {
                            code: 'ERRIVRS', // Error InValid ReSponse
                        })
                    );

                toast.success(t('waitlist.join.submitted.success'));
                return true;
            } catch (e) {
                toast.error(
                    t('waitlist.join.submitted.error', {
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
            toast.error(t('waitlist.join.submitted.invalid-email'));
    };

    const onSuccessPostVerified = async (values: TPostVerifiedForm) => {
        if (!email || !secret) return;

        (async () => {
            setIcon(false);

            let err;
            const tests = {
                length: values.newpassword.length > 7,
                lowercase: !!/[a-z]/.test(values.newpassword),
                uppercase: !!/[A-Z]/.test(values.newpassword),
                number: !!/[0-9]/.test(values.newpassword),
                special: !!/[^a-zA-Z0-9]/.test(values.newpassword),
            };

            if (Object.values(tests).includes(false)) {
                const missing = Object.keys(tests).filter(
                    (t) => !tests[t as keyof typeof tests]
                );

                err = toast.error(
                    t('account.security.password-validation.invalid', {
                        criteria:
                            missing
                                .slice(0, -1)
                                .map((a) =>
                                    t(
                                        `account.security.password-validation.test-${a}`
                                    )
                                )
                                .join(', ') +
                            (missing.length > 0
                                ? ` ${t('common:and')} ${t(
                                      `account.security.password-validation.test-${
                                          missing.slice(-1)[0]
                                      }`
                                  )}`
                                : ''),
                    }) as string
                );
            }
            if (values.newpassword !== values.verifypassword)
                err = toast.error(
                    t('account.security.password-validation.no-match')
                );
            if (err) return;

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
                        t('account.security.submitted.error-criteria-not-met')
                    )
                );

            toast.success(t('account.security.submitted.success'));
            return true;
        })().then((success) => {
            if (success) {
                setIcon(Check);
                setTimeout(() => setIcon(Save), 1000);
            } else {
                setIcon(Save);
            }
        });
    };

    const onFailurePostVerified = async (
        faulty: FieldErrors<TPostVerifiedForm>
    ) => {
        if (faulty.newpassword)
            toast.error(t('account.security.fields.newpassword.faulty'));
    };

    if ((email && secret) || success !== undefined) {
        return (
            <LayoutContentMiddle>
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
                                    'account.security.fields.newpassword.placeholder'
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
                                    'account.security.fields.verifypassword.placeholder'
                                ) as string
                            }
                            type="password"
                            {...postVerifiedForm.register('verifypassword')}
                        />
                    </div>
                    <ButtonLarge
                        text={t('account.security.submitted.button') as string}
                        icon={ActiveIcon && <ActiveIcon size={22} />}
                        loading={!ActiveIcon}
                        disabled={!ActiveIcon}
                    />
                </form>
            </LayoutContentMiddle>
        );
    } else {
        return (
            <LayoutContentMiddle>
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
                            placeholder="Enter your E-mail address"
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
                        text={t('account.security.submitted.button') as string}
                        icon={ActiveIcon && <ActiveIcon size={22} />}
                        loading={!ActiveIcon}
                        disabled={!ActiveIcon}
                    />
                </form>
            </LayoutContentMiddle>
        );
    }
}
