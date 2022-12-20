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
import { requestImageUploadURL } from '../../lib/ImageUpload';
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PercentCrop,
} from 'react-image-crop';
import Modal from '../../components/Modal';
import profilePictureStyles from '../../styles/components/modal/ProfilePicture.module.scss';

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
    const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

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

                    <Modal show={showUploadModal} title={t("account.profile.avatar-modal-title") as string} onClose={() => { setShowUploadModal(false); }}>
                        <UpdateProfilePicture />

                        <ButtonLarge
                            text="Fetch Upload URL"
                            onClick={() => {
                                requestImageUploadURL().then(console.log);
                            }}
                        />
                    </Modal>

                    <ButtonLarge text={t("account.profile.upload-avatar") as string} onClick={() => { setShowUploadModal(true); }} />

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

export function UpdateProfilePicture() {
    const [uploaded, setUploaded] = useState<File | null>(null);
    const [blob, setBlob] = useState<Blob>();

    return (
        <>
            <input
                type="file"
                onChange={(e) => {
                    setUploaded(e.target.files && e.target.files[0]);
                }}
            />

            {uploaded && (
                <CropProfilePicture file={uploaded} setBlob={setBlob} />
            )}

            {blob && (
                <>
                    <h2>Preview</h2>
                    {
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={URL.createObjectURL(blob)} alt="Preview" width={400} />
                    }
                </>
            )}
        </>
    );
}

function centerAspectCrop(
    mediaWidth: number,
    mediaHeight: number,
    aspect: number
) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 100,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

async function getCroppedImg(input: HTMLImageElement, crop: PercentCrop) {
    const image = new Image();
    return new Promise<Blob>((resolve) => {
        image.addEventListener('load', () => {
            console.log(image.width, image.height);
            crop.x = (image.width / 100) * crop.x;
            crop.y = (image.height / 100) * crop.y;
            crop.width = (image.width / 100) * crop.width;
            crop.height = (image.height / 100) * crop.height;

            const canvas = document.createElement('canvas');
            canvas.width = crop.width;
            canvas.height = crop.height;
            const ctx = canvas.getContext('2d');

            ctx?.drawImage(
                image,
                crop.x,
                crop.y,
                crop.width * 2,
                crop.height * 2,
                0,
                0,
                image.width,
                image.height
            );

            const dataURI = canvas.toDataURL();
            let byteString;
            if (dataURI.split(',')[0].indexOf('base64') >= 0)
                byteString = atob(dataURI.split(',')[1]);
            else byteString = unescape(dataURI.split(',')[1]);

            // separate out the mime component
            const mimeString = dataURI
                .split(',')[0]
                .split(':')[1]
                .split(';')[0];

            // write the bytes of the string to a typed array
            const ia = new Uint8Array(byteString.length);
            for (let i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }
            resolve(new Blob([ia], { type: mimeString }));
        });

        image.src = input.src;
    });
}

export function CropProfilePicture({
    file,
    setBlob,
}: {
    file: File;
    setBlob: (blob: Blob) => void;
}) {
    const [crop, setCrop] = useState<Crop>();
    const [size, setSize] = useState<{
        width: number;
        height: number;
    }>({
        width: 0,
        height: 0,
    });

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.addEventListener('load', function () {
        if (size.width !== this.width && size.height !== this.height) {
            setSize(this);
            setCrop(centerAspectCrop(this.width, this.height, 1));
        }
    });

    img.src = url;
    img.alt = 'Selected picture';

    return (
        <div className={profilePictureStyles.crop}>
            <ReactCrop
                crop={crop}
                onChange={(c) => setCrop(c)}
                aspect={1}
                onComplete={async (_, percentage) => {
                    setBlob(await getCroppedImg(img, percentage));
                }}
                circularCrop={true}
                keepSelection={true}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="Uploaded picture" style={{ width: '400px' }} />
            </ReactCrop>
        </div>
        
    );
}
