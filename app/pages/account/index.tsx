import React, { useState } from 'react';
import { toast } from 'react-toastify';
import moment from 'moment';

import {
    useAuthState,
    useDelayedRefreshAuthenticatedUser,
} from '../../hooks/KardsUser';
import AccountLayout from '../../components/Layout/Account';
import { UpdateAuthenticatedUser } from '../../lib/KardsUser';
import { Form } from '../../components/Form';
import { FormInputField } from '../../components/Form/InputField';
import { TForm, TFormItemTheming } from '../../constants/Types';
import { ButtonLarge } from '../../components/Button';
import { useTranslation } from 'react-i18next';
import { Check, Icon, Save } from 'react-feather';

export default function Account() {
    const auth = useAuthState();
    const refreshAccount = useDelayedRefreshAuthenticatedUser();
    const [ActiveIcon, setIcon] = useState<Icon | false>(Save);
    const { t } = useTranslation('pages');

    const InputTheme: TFormItemTheming = {
        tint: 'Light',
        noBorder: true,
        size: 'Small',
    };

    const Input = {
        Name: new FormInputField({
            ...InputTheme,
            placeholder: t('account.profile.fields.name.placeholder') as string,
            label: t('account.profile.fields.name.label') as string,
            name: 'name',
            default: auth.details?.name,
            isValid: (value) => value.trim().split(' ').length > 1,
        }),
        Username: new FormInputField({
            ...InputTheme,
            placeholder: t(
                'account.profile.fields.username.placeholder'
            ) as string,
            label: t('account.profile.fields.username.label') as string,
            name: 'username',
            default: auth.details?.username,
            process: (value) => value.trim().toLowerCase(),
            isValid: (value) =>
                /^[a-z0-9](?:[a-z0-9._-]{1,18}[a-z0-9.])$/.test(value),
        }),
        Email: new FormInputField({
            ...InputTheme,
            placeholder: t(
                'account.profile.fields.email.placeholder'
            ) as string,
            label: t('account.profile.fields.email.label') as string,
            name: 'email',
            default: auth.details?.email,
            isValid: (value) =>
                /^[A-ZÀ-ÖØ-öø-ÿ0-9._%+-]+@[A-ZÀ-ÖØ-öø-ÿ0-9.-]+\.[A-Z]{2,}$/i.test(
                    value
                ),
        }),
    };

    const saveProfile: TForm['onSubmit'] = async ({ values, faulty }) => {
        (async () => {
            setIcon(false);
            if (faulty.name)
                toast.error(t('account.profile.fields.name.faulty') as string);
            if (faulty.username)
                toast.error(
                    t('account.profile.fields.username.faulty') as string
                );
            if (faulty.email)
                toast.error(t('account.profile.fields.email.faulty') as string);
            if (Object.keys(faulty).length > 0) return;

            if (values.email !== auth.details?.email)
                toast.warn(t('account.profile.submitted.error-email'));
            delete values.email;

            if (await UpdateAuthenticatedUser(values)) {
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

                    <Form
                        {...{
                            onSubmit: saveProfile,
                            inputs: Object.values(Input),
                        }}
                    >
                        <Input.Name.render />
                        <Input.Username.render />
                        <Input.Email.render />
                        <br />
                        <br />
                        <br />
                        <ButtonLarge
                            text={
                                t('account.profile.submitted.button') as string
                            }
                            icon={ActiveIcon && <ActiveIcon size={22} />}
                            loading={!ActiveIcon}
                        />
                    </Form>
                </div>
            )}
        </AccountLayout>
    );
}
