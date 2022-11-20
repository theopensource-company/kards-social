import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import ArrowBack from '../components/Icon/ArrowBack';
import { toast } from 'react-toastify';

import styles from '../styles/pages/JoinWaitlist.module.scss';
import axios from 'axios';
import Logo from '../components/Logo';
import { FormInputField } from '../components/Form/InputField';
import LayoutContentMiddle from '../components/Layout/ContentMiddle';
import {
    SurrealEndpoint,
    SurrealNamespace,
    SurrealDatabase,
    SurrealQuery,
} from '../lib/Surreal';
import { useTranslation } from 'react-i18next';
import { FieldErrors, useForm } from 'react-hook-form';
import { Check, Icon, Send } from 'react-feather';

type TWaitlistFields = {
    name: `${string} ${string}`;
    email: string;
};

export default function JoinWaitlist() {
    const router = useRouter();
    const { email, secret, success } = router.query;
    const [ActiveIcon, setIcon] = useState<Icon | boolean>(
        email && secret ? false : Send
    );
    const { register, handleSubmit } = useForm<TWaitlistFields>();
    const { t } = useTranslation('pages');

    const onSuccess = async (values: TWaitlistFields) => {
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
                        recipient: values.name,
                        template: 'waitlist',
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

    const onFailure = (faulty: FieldErrors<TWaitlistFields>) => {
        if (faulty.name) toast.error(t('waitlist.join.submitted.invalid-name'));
        if (faulty.email)
            toast.error(t('waitlist.join.submitted.invalid-email'));
    };

    useEffect(() => {
        if (email && secret)
            axios
                .post(
                    `${SurrealEndpoint.slice(0, -4)}/signup`,
                    {
                        NS: SurrealNamespace,
                        DB: SurrealDatabase,
                        SC: 'waitlist',
                        email,
                        secret,
                    },
                    {
                        headers: {
                            Accept: 'application/json',
                        },
                    }
                )
                .then(() => {
                    setIcon(true);
                    router.push(`${location.pathname}?success`);
                })
                .catch((e) => {
                    if (parseInt(e.response.status) !== 403)
                        return toast.error(
                            t('waitlist.join.submitted.error', {
                                code: 'ERRNNWR', // Error No NetWork Response
                            })
                        );

                    setIcon(true);
                    router.push(`${location.pathname}?success`);
                });
    }, [email, secret, setIcon, router, t]);

    if ((email && secret) || success !== undefined) {
        return (
            <LayoutContentMiddle robots="noindex, follow">
                <div className={styles.form}>
                    <Logo />
                    <p className={styles.success}>
                        {
                            t(
                                `waitlist.joined.${
                                    !ActiveIcon ? 'working' : 'done'
                                }.description`
                            ) as string
                        }
                    </p>
                    <Button
                        onClick={() => router.push('/')}
                        text={
                            t(
                                `waitlist.joined.${
                                    !ActiveIcon ? 'working' : 'done'
                                }.button`
                            ) as string
                        }
                        loading={!ActiveIcon}
                    />
                </div>
            </LayoutContentMiddle>
        );
    } else {
        return (
            <LayoutContentMiddle>
                <div className={styles.back}>
                    <Button
                        text={t('common:back') as string}
                        icon={<ArrowBack />}
                        size="Small"
                        onClick={() => router.push('/')}
                    />
                </div>
                <form
                    className={styles.form}
                    onSubmit={handleSubmit(onSuccess, onFailure)}
                >
                    <Logo />
                    <div className={styles.inputs}>
                        <FormInputField
                            placeholder={
                                t('waitlist.join.input-fullname') as string
                            }
                            {...register('name', {
                                validate: (v) =>
                                    v &&
                                    /^[A-ZÀ-ÖØ-öø-ÿ]+ [A-ZÀ-ÖØ-öø-ÿ][A-ZÀ-ÖØ-öø-ÿ ]*$/i.test(
                                        v
                                    ),
                            })}
                        />
                        <FormInputField
                            type="email"
                            placeholder={
                                t('waitlist.join.input-email') as string
                            }
                            {...register('email', {
                                validate: (v) =>
                                    v &&
                                    /^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i.test(
                                        v
                                    ),
                            })}
                        />
                    </div>
                    <Button
                        text={t('waitlist.join.button') as string}
                        icon={
                            typeof ActiveIcon != 'boolean' && (
                                <ActiveIcon size={22} />
                            )
                        }
                        loading={!ActiveIcon}
                    />
                </form>
            </LayoutContentMiddle>
        );
    }
}
