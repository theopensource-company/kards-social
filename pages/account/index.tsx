import moment from 'moment';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { Camera, Check, Icon, Save } from 'react-feather';
import { FieldErrors, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ButtonLarge } from '../../components/Button';
import ProfilePicture from '../../components/Common/ProfilePicture';
import { FormInputField } from '../../components/Form/InputField';
import AccountLayout from '../../components/Layout/Account';
import ChangeProfilePictureModal from '../../components/Modal/Variants/ChangeProfilePictureModal';
import { usernameValidationSections } from '../../constants/KeypressValidators/username';
import { keypressValidation } from '../../lib/KeypressValidation';

import { TFormItemTheming } from '../../constants/Types/Form.types';
import { TUpdateKardsUser } from '../../constants/Types/KardsUser.types';
import {
    useAuthenticatedKardsUser,
    useUpdateAuthenticatedKardsUser,
} from '../../hooks/Queries/Auth';
import styles from '../../styles/pages/Account/Profile.module.scss';

export default function Account() {
    const {
        data: user,
        isLoading: isUserLoading,
        refetch: refetchAuthenticatedUser,
    } = useAuthenticatedKardsUser();
    const { mutate: updateAuthenticatedUser } =
        useUpdateAuthenticatedKardsUser();
    const [ActiveIcon, setIcon] = useState<Icon | false>(Save);
    const { register, handleSubmit, getValues, setValue } =
        useForm<TUpdateKardsUser>();
    const { t } = useTranslation('pages');
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

    const InputTheme: TFormItemTheming = {
        tint: 'Light',
        noBorder: true,
        size: 'Small',
    };

    const onSuccess = async (values: TUpdateKardsUser) => {
        setIcon(false);

        if (values.email !== user?.email)
            toast.warn(t('account.profile.submitted.error-email'));

        updateAuthenticatedUser(
            {
                name: values.name,
                username: values.username,
            },
            {
                onSuccess: () => {
                    toast.success(t('account.profile.submitted.success'));
                    refetchAuthenticatedUser();

                    setTimeout(() => setIcon(Save), 1000);
                    setIcon(Check);
                },
                onError: () => {
                    toast.error(t('account.profile.submitted.error-failed'));
                    setIcon(Save);
                },
            }
        );
    };

    const onFailure = async (faulty: FieldErrors<TUpdateKardsUser>) => {
        if (faulty.name)
            toast.error(t('account.profile.fields.name.faulty') as string);
        if (faulty.username)
            toast.error(t('account.profile.fields.username.faulty') as string);
        if (faulty.email)
            toast.error(t('account.profile.fields.email.faulty') as string);
    };

    return (
        <AccountLayout activeKey="profile">
            {!isUserLoading && user && (
                <div>
                    <div className={styles.intro}>
                        <div
                            className={styles.picture}
                            onClick={() => {
                                setShowUploadModal(true);
                            }}
                        >
                            <ProfilePicture variant="Small" />
                            <div className={styles.pictureHover}>
                                <Camera
                                    size={40}
                                    className={styles.pictureHoverIcon}
                                />
                                <p>{t('common:change')}</p>
                            </div>
                        </div>

                        <div className={styles.introInfo}>
                            <h1>{user.name}</h1>
                            <p>
                                {t('account.profile.member-since-days', {
                                    days:
                                        moment(new Date()).diff(
                                            moment(user.created),
                                            'days'
                                        ) + 1,
                                })}
                            </p>
                        </div>
                    </div>

                    <ChangeProfilePictureModal
                        show={showUploadModal}
                        onClose={() => setShowUploadModal(false)}
                    />

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
                            defaultValue={user.name}
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
                            defaultValue={user.username}
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
                            defaultValue={user.email}
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
