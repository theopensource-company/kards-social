import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import ArrowBack from '../components/Icon/ArrowBack';
import { toast } from 'react-toastify';

import styles from '../styles/pages/JoinWaitlist.module.scss';
import axios from 'axios';
import Logo from '../components/Logo';
import { Form } from '../components/Form';
import { FormInputField } from '../components/Form/InputField';
import { TForm } from '../constants/Types';
import LayoutContentMiddle from '../components/Layout/ContentMiddle';
import {
    SurrealEndpoint,
    SurrealNamespace,
    SurrealDatabase,
    SurrealQuery,
} from '../lib/Surreal';
import { useTranslation } from 'react-i18next';

export default function JoinWaitlist() {
    const router = useRouter();
    const { email, secret, success } = router.query;
    const [working, setWorking] = useState(!!(email && secret));
    const { t } = useTranslation('pages');

    const submitForm: TForm['onSubmit'] = async ({ values, faulty }) => {
        if (faulty.name) toast.error(t('waitlist.join.submitted.invalid-name'));
        if (faulty.email)
            toast.error(t('waitlist.join.submitted.invalid-email'));
        if (Object.keys(faulty).length > 0) return;

        setWorking(true);
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
        } catch (e) {
            toast.error(
                t('waitlist.join.submitted.error', {
                    code: 'ERRNNWR', // Error No NetWork Response
                })
            );
        }

        setWorking(false);
    };

    const inputName = new FormInputField({
        name: 'name',
        placeholder: t('waitlist.join.input-fullname') as string,
        isValid: (value) =>
            /^[A-ZÀ-ÖØ-öø-ÿ]+ [A-ZÀ-ÖØ-öø-ÿ][A-ZÀ-ÖØ-öø-ÿ ]*$/i.test(value),
    });

    const inputEmail = new FormInputField({
        name: 'email',
        placeholder: t('waitlist.join.input-email') as string,
        isValid: (value) =>
            /^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i.test(
                value
            ),
    });

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
                    setWorking(false);
                    router.push(`${location.pathname}?success`);
                })
                .catch((e) => {
                    if (parseInt(e.response.status) !== 403)
                        return toast.error(
                            t('waitlist.join.submitted.error', {
                                code: 'ERRNNWR', // Error No NetWork Response
                            })
                        );

                    setWorking(false);
                    router.push(`${location.pathname}?success`);
                });
    }, [email, secret, setWorking, router, t]);

    if ((email && secret) || success !== undefined) {
        return (
            <LayoutContentMiddle robots="noindex, follow">
                <div className={styles.form}>
                    <Logo />
                    <p className={styles.success}>
                        {
                            t(
                                `waitlist.joined.${
                                    working ? 'working' : 'done'
                                }.description`
                            ) as string
                        }
                    </p>
                    <Button
                        onClick={() => router.push('/')}
                        text={
                            t(
                                `waitlist.joined.${
                                    working ? 'working' : 'done'
                                }.button`
                            ) as string
                        }
                        loading={working}
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
                <Form
                    className={styles.form}
                    inputs={[inputName, inputEmail]}
                    onSubmit={submitForm}
                >
                    <Logo />
                    <div className={styles.inputs}>
                        <inputName.render />
                        <inputEmail.render />
                    </div>
                    <Button
                        text={t('waitlist.join.button') as string}
                        loading={working}
                    />
                </Form>
            </LayoutContentMiddle>
        );
    }
}
