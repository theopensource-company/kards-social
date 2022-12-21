import React, { useState } from 'react';
import Modal from '../';
import { useTranslation } from 'react-i18next';
import { ButtonLarge } from '../../Button';
import { requestImageUploadURL } from '../../../lib/ImageUpload';
import ReactCrop, {
    Crop,
    PercentCrop,
    centerCrop,
    makeAspectCrop,
} from 'react-image-crop';
import styles from '../../../styles/components/modal/ChangeProfilePicture.module.scss';
import { toast } from 'react-toastify';
import axios from 'axios';
import { SurrealQuery } from '../../../lib/Surreal';

export default function ChangeProfilePictureModal({
    show,
    onClose,
}: {
    show: boolean;
    onClose: () => void;
}) {
    const { t } = useTranslation('pages');
    const [uploaded, setUploaded] = useState<File | null>(null);
    const [blob, setBlob] = useState<Blob>();

    return (
        <Modal
            show={show}
            title={t('account.profile.avatar-modal-title') as string}
            onClose={onClose}
            className={styles.modal}
        >
            {uploaded && (
                <div className={styles.preview}>
                    <CropProfilePicture file={uploaded} setBlob={setBlob} />

                    <hr />

                    {
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={blob ? URL.createObjectURL(blob) : ''}
                            alt="Preview"
                            className={styles.result}
                        />
                    }
                </div>
            )}

            <input
                type="file"
                onChange={(e) => {
                    setUploaded(e.target.files && e.target.files[0]);
                }}
            />

            <ButtonLarge
                text="Save"
                onClick={async () => {
                    if (!blob) {
                        toast.error('Make a selection first');
                        return;
                    }

                    const data = new FormData();
                    data.append('file', blob, 'profilepicture.png');
                    const rawResult = await requestImageUploadURL();

                    if (rawResult) {
                        const { id: imageRecordID, uploadURL } = rawResult;
                        axios
                            .post(uploadURL, data, {
                                timeout: 30000,
                            })
                            .then(async (res) => {
                                if (res.data?.success) {
                                    const updateProfileResult =
                                        await SurrealQuery(
                                            `UPDATE user SET picture = ${imageRecordID}`
                                        );

                                    console.log(updateProfileResult);
                                } else {
                                    toast.error('Failed to update profile');
                                }
                            });
                    } else {
                        toast.error('Failed to upload picture');
                    }
                }}
            />
        </Modal>
    );
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
        <div className={styles.crop}>
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
                <img
                    src={url}
                    alt="Uploaded picture"
                    style={{ width: '400px' }}
                />
            </ReactCrop>
        </div>
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
                crop.width,
                crop.height,
                0,
                0,
                crop.width,
                crop.height
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
