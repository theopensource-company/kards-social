import React, { useState } from 'react';
import { Check, Icon, Save } from 'react-feather';
import { useTranslation } from 'react-i18next';
import { Id, toast } from 'react-toastify';
import { ButtonLarge } from '../../components/Button';
import { Form } from '../../components/Form';
import { FormInputField } from '../../components/Form/InputField';
import AccountLayout from '../../components/Layout/Account';
import { TForm, TFormItemTheming } from '../../constants/Types';
import { UpdateAuthenticatedUserPassword } from '../../lib/KardsUser';

export default function Account() {
    const { t } = useTranslation('pages');
    const [ActiveIcon, setIcon] = useState<Icon | false>(Save);
    const InputTheme: TFormItemTheming = {
        tint: 'Light',
        noBorder: true,
        size: 'Small',
    };

    const Input = {
        PasswordOld: new FormInputField({
            ...InputTheme,
            placeholder: t(
                'account.security.fields.oldpassword.placeholder'
            ) as string,
            label: t('account.security.fields.oldpassword.label') as string,
            name: 'oldpassword',
            type: 'Password',
            isValid: (value) => value != '',
        }),
        PasswordNew: new FormInputField({
            ...InputTheme,
            placeholder: t(
                'account.security.fields.newpassword.placeholder'
            ) as string,
            label: t('account.security.fields.newpassword.label') as string,
            name: 'newpassword',
            type: 'Password',
            isValid: (value) => value != '',
        }),
        PasswordNewVerify: new FormInputField({
            ...InputTheme,
            placeholder: t(
                'account.security.fields.verifypassword.placeholder'
            ) as string,
            label: t('account.security.fields.verifypassword.label') as string,
            name: 'verifypassword',
            type: 'Password',
        }),
    };

    const updatePassword: TForm['onSubmit'] = async ({ values, faulty }) => {
        (async () => {
            setIcon(false);

            let err: null | Id = null;
            if (faulty.oldpassword)
                err = toast.error('enter your old password');
            if (faulty.newpassword) err = toast.error('Enter a new password');
            if (err) return;

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

            const result = await UpdateAuthenticatedUserPassword({
                oldpassword: values.oldpassword,
                newpassword: values.newpassword,
            });

            if (!result.password_correct)
                return (
                    false &&
                    toast.error(
                        t('account.security.submitted.error-invalid-password')
                    )
                );
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

    return (
        <AccountLayout activeKey="security">
            <h1>Security</h1>
            <Form
                {...{
                    onSubmit: updatePassword,
                    inputs: Object.values(Input),
                }}
            >
                <Input.PasswordOld.render />
                <Input.PasswordNew.render />
                <Input.PasswordNewVerify.render />
                <br />
                <br />
                <br />
                <ButtonLarge
                    text={t('account.security.submitted.button') as string}
                    icon={ActiveIcon && <ActiveIcon size={22} />}
                    loading={!ActiveIcon}
                />
            </Form>
        </AccountLayout>
    );
}
