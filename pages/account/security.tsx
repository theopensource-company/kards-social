import React, { useState } from 'react';
import { Check, Icon, Save } from 'react-feather';
import { FieldErrors, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ButtonLarge } from '../../components/Button';
import { FormInputField } from '../../components/Form/InputField';
import AccountLayout from '../../components/Layout/Account';
import { TFormItemTheming } from '../../constants/Types';
import usePasswordValidator from '../../hooks/FieldValidation/password';
import { UpdateAuthenticatedUserPassword } from '../../lib/KardsUser';

type TSecurityFields = {
    oldpassword: string;
    newpassword: string;
    verifypassword: string;
};

export default function Account() {
    const { t } = useTranslation('pages');
    const [ActiveIcon, setIcon] = useState<Icon | false>(Save);
    const { register, handleSubmit, reset } = useForm<TSecurityFields>();
    const { isValidPassword } = usePasswordValidator();

    const InputTheme: TFormItemTheming = {
        tint: 'Light',
        noBorder: true,
        size: 'Small',
    };

    const onSuccess = async (values: TSecurityFields) => {
        (async () => {
            setIcon(false);

            if (!isValidPassword(values)) return;
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

            reset();
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

    const onFailure = async (faulty: FieldErrors<TSecurityFields>) => {
        if (faulty.oldpassword)
            toast.error(t('account.security.fields.oldpassword.faulty'));
        if (faulty.newpassword)
            toast.error(t('account.security.fields.newpassword.faulty'));
    };

    return (
        <AccountLayout activeKey="security">
            <h1>{t('account.security.title')}</h1>
            <form onSubmit={handleSubmit(onSuccess, onFailure)}>
                <FormInputField
                    placeholder={
                        t(
                            'account.security.fields.oldpassword.placeholder'
                        ) as string
                    }
                    label={
                        t('account.security.fields.oldpassword.label') as string
                    }
                    type="password"
                    {...InputTheme}
                    {...register('oldpassword', {
                        validate: (v) => v && v !== '',
                    })}
                />
                <FormInputField
                    placeholder={
                        t(
                            'account.security.fields.newpassword.placeholder'
                        ) as string
                    }
                    label={
                        t('account.security.fields.newpassword.label') as string
                    }
                    type="password"
                    {...InputTheme}
                    {...register('newpassword', {
                        validate: (v) => v && v !== '',
                    })}
                />
                <FormInputField
                    placeholder={
                        t(
                            'account.security.fields.verifypassword.placeholder'
                        ) as string
                    }
                    label={
                        t(
                            'account.security.fields.verifypassword.label'
                        ) as string
                    }
                    type="password"
                    {...InputTheme}
                    {...register('verifypassword')}
                />
                <br />
                <br />
                <br />
                <ButtonLarge
                    text={t('account.security.submitted.button') as string}
                    icon={ActiveIcon && <ActiveIcon size={22} />}
                    loading={!ActiveIcon}
                    disabled={!ActiveIcon}
                />
            </form>
        </AccountLayout>
    );
}
