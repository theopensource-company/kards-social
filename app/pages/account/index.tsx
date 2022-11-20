import React, { useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';

import {
    useAuthState,
    useDelayedRefreshAuthenticatedUser,
} from '../../hooks/KardsUser';
import AccountLayout from '../../components/Layout/Account';
import { UpdateAuthenticatedUser } from '../../lib/KardsUser';
import { FormInputField } from '../../components/Form/InputField';
import { TFormItemTheming } from '../../constants/Types';
import { ButtonLarge } from '../../components/Button';
import { useTranslation } from 'react-i18next';
import { Check, Icon, Save } from 'react-feather';
import { FieldErrors, useForm } from 'react-hook-form';
import { keypressValidation } from '../../lib/KeypressValidation';
import { usernameValidationSections } from '../../constants/KeypressValidators/username';

type TProfileFields = {
    name: `${string} ${string}`;
    username: string;
    email: string;
};

export default function Account() {
    const auth = useAuthState();
    const refreshAccount = useDelayedRefreshAuthenticatedUser();
    const [ActiveIcon, setIcon] = useState<Icon | false>(Save);
    const { register, handleSubmit, getValues, setValue } =
        useForm<TProfileFields>();
    const { t } = useTranslation('pages');

    const InputTheme: TFormItemTheming = {
        tint: 'Light',
        noBorder: true,
        size: 'Small',
    };

    const onSuccess = async (values: TProfileFields) => {
        (async () => {
            setIcon(false);

            if (values.email !== auth.details?.email)
                toast.warn(t('account.profile.submitted.error-email'));

            if (
                await UpdateAuthenticatedUser({
                    name: values.name,
                    username: values.username,
                })
            ) {
                refreshAccount();
                toast.success(t('account.profile.submitted.success'));
                return true;
            } else {
                toast.error(t('account.profile.submitted.error-failed'));
            }
        })().then((success) => {
            if (success) {
                setIcon(Check);
                setTimeout(() => setIcon(Save), 1000);
            } else {
                setIcon(Save);
            }
        });
    };

    const onFailure = async (faulty: FieldErrors<TProfileFields>) => {
        if (faulty.name)
            toast.error(t('account.profile.fields.name.faulty') as string);
        if (faulty.username)
            toast.error(t('account.profile.fields.username.faulty') as string);
        if (faulty.email)
            toast.error(t('account.profile.fields.email.faulty') as string);
    };

    return (
        <AccountLayout activeKey="profile">
            {auth.details && (
                <div>
                    <h1>{auth.details.name}</h1>
                    <p>
                        {t('account.profile.member-since-days', {
                            days:
                                moment(new Date()).diff(
                                    moment(auth.details?.created),
                                    'days'
                                ) + 1,
                        })}
                    </p>

                    <form onSubmit={handleSubmit(onSuccess, onFailure)}>
                        <FormInputField
                            placeholder={
                                t(
                                    'account.profile.fields.name.placeholder'
                                ) as string
                            }
                            label={
                                t('account.profile.fields.name.label') as string
                            }
                            defaultValue={auth.details.name}
                            {...InputTheme}
                            {...register('name', {
                                validate: (v) =>
                                    v && v.trim().split(' ').length > 1,
                            })}
                        />
                        <FormInputField
                            placeholder={
                                t(
                                    'account.profile.fields.username.placeholder'
                                ) as string
                            }
                            label={
                                t(
                                    'account.profile.fields.username.label'
                                ) as string
                            }
                            defaultValue={auth.details.username}
                            {...InputTheme}
                            {...register('username', {
                                validate: (v) =>
                                    v &&
                                    /^[a-z0-9](?:[a-z0-9._-]{1,18}[a-z0-9.])$/.test(
                                        v
                                    ),
                            })}
                            onKeyDown={keypressValidation(
                                getValues,
                                setValue,
                                'username',
                                usernameValidationSections(t)
                            )}
                        />
                        <FormInputField
                            placeholder={
                                t(
                                    'account.profile.fields.email.placeholder'
                                ) as string
                            }
                            label={
                                t(
                                    'account.profile.fields.email.label'
                                ) as string
                            }
                            defaultValue={auth.details.email}
                            {...InputTheme}
                            {...register('email', {
                                validate: (v) =>
                                    v &&
                                    /^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i.test(
                                        v
                                    ),
                            })}
                        />
                        <br />
                        <br />
                        <br />
                        <ButtonLarge
                            text={
                                t('account.profile.submitted.button') as string
                            }
                            icon={ActiveIcon && <ActiveIcon size={22} />}
                            loading={!ActiveIcon}
                            disabled={!ActiveIcon}
                        />
                    </form>
                </div>
            )}
        </AccountLayout>
    );
}
