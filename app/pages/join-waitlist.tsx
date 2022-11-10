import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '../components/Button';
import ArrowBack from '../components/icon/ArrowBack';
import { toast } from 'react-toastify';

import styles from '../styles/JoinWaitlist.module.scss';
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

export default function JoinWaitlist() {
    const router = useRouter();
    const { email, secret, success } = router.query;
    const [working, setWorking] = useState(!!(email && secret));

    console.log(router.query);

    const submitForm: TForm['onSubmit'] = async ({ values, faulty }) => {
        if (faulty.name) toast.error('Please enter your full name');
        if (faulty.email) toast.error('Please enter a valid email');
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
                    'Something went wrong, please try again later or contact hi@kards.social (Code: ERRNORS)' // Error NO ReSponse
                );
            if (result[0].result[0].email !== values.email)
                return toast.error(
                    'Something went wrong, please try again later or contact hi@kards.social (Code: ERRIVRS)' // Error InValid ReSponse
                );

            toast.success('Check you inbox and spam for a verification email!');
        } catch (e) {
            toast.error(
                'Something went wrong, please try again later or contact hi@kards.social (Code: ERRNNWR)' // Error No NetWork Response
            );
        }

        setWorking(false);
    };

    const inputName = new FormInputField({
        name: 'name',
        placeholder: 'Full Name',
        isValid: (value) =>
            /^[A-ZÀ-ÖØ-öø-ÿ]+ [A-ZÀ-ÖØ-öø-ÿ][A-ZÀ-ÖØ-öø-ÿ ]*$/i.test(value),
    });

    const inputEmail = new FormInputField({
        name: 'email',
        placeholder: 'Email',
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
                            'Something went wrong, please try again later or contact hi@kards.social (Code: ERRNNWR)' // Error No NetWork Response
                        );

                    setWorking(false);
                    router.push(`${location.pathname}?success`);
                });
    }, [email, secret, setWorking, router]);

    if ((email && secret) || success !== undefined) {
        return (
            <LayoutContentMiddle robots="noindex, follow">
                <div className={styles.form}>
                    <Logo />
                    <p className={styles.success}>
                        {working
                            ? 'Adding you to the waitlist'
                            : 'You have been added to the waitlist!'}
                    </p>
                    <Button
                        onClick={() => router.push('/')}
                        text={working ? 'Loading' : 'Go back'}
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
                        text="Back"
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
                    <Button text="Join waitlist" loading={working} />
                </Form>
            </LayoutContentMiddle>
        );
    }
}
