import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import Modal from '../';
import { useTranslation } from 'react-i18next';
import { ButtonLarge } from '../../Button';
import {
    requestImageUploadURL,
    CREATE_IMAGE_REFETCH_INTERVAL,
    CREATE_IMAGE_REFETCH_LIMIT,
} from '../../../lib/ImageUpload';
import ReactCrop, {
    Crop,
    PercentCrop,
    centerCrop,
    makeAspectCrop,
} from 'react-image-crop';
import styles from '../../../styles/components/modal/ChangeProfilePicture.module.scss';
import { Id, toast } from 'react-toastify';
import axios from 'axios';
import { SurrealQuery } from '../../../lib/Surreal';
import { TKardsUserDetails } from '../../../constants/Types';
import { useDelayedRefreshAuthenticatedUser } from '../../../hooks/KardsUser';
import { useDropzone } from 'react-dropzone';
import { RotateCw as RotateCwIcon, Save as SaveIcon } from 'react-feather';
import Spinner from '../../Icon/Spinner';

export default function ChangeProfilePictureModal({
    show,
    onClose,
}: {
    show: boolean;
    onClose: () => void;
}) {
    const { t } = useTranslation('components');
    const [uploaded, setUploaded] = useState<File | null>(null);
    const refreshUserDetails = useDelayedRefreshAuthenticatedUser();
    const [blob, setBlob] = useState<Blob | null>(null);
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const toastId = React.useRef(null as unknown as Id);

    // FIXME: Nasty workaround to force react-image-crop to reexecute the "onComplete" function by unrendering and rerendering the whole component.
    // This is needed because otherwise the output will not update when selecting a new picture.
    const [refresh, setRefresh] = useState(true);
    useEffect(() => {
        if (!refresh) setRefresh(true);
    }, [refresh, setRefresh]);

    const onDrop = useCallback((files: File[]) => {
        setUploaded(files && files[0]);
        setRefresh(false);
    }, []);

    const { getRootProps, getInputProps, open } = useDropzone({
        onDrop,
        noClick: true,
        noKeyboard: true,
    });

    const saveImage = async () => {
        if (!blob) {
            toast.error(t('modal.change-profile-picture.make-selection'));
            return;
        }

        toastId.current = toast.info(
            t('modal.change-profile-picture.requesting-url'),
            {
                autoClose: false,
                closeOnClick: false,
                icon: <Spinner color="Light" />,
            }
        );

        let urlRequestProgress = 0;
        const urlRequestInterval = setInterval(() => {
            urlRequestProgress++;
            toast.update(toastId.current, {
                progress: Math.round(urlRequestProgress / 2.5) / 100,
            });

            if (urlRequestProgress >= 100) {
                clearInterval(urlRequestInterval);
            }
        }, (CREATE_IMAGE_REFETCH_INTERVAL * CREATE_IMAGE_REFETCH_LIMIT * 2.5) / 100);

        (async (): Promise<true | void> => {
            setIsUploading(true);

            const data = new FormData();
            data.append('file', blob, 'profilepicture.png');
            const rawResult = await requestImageUploadURL();

            clearInterval(urlRequestInterval);
            toast.update(toastId.current, {
                render: t('modal.change-profile-picture.uploading-image'),
                closeOnClick: false,
                progress: 0.4,
            });

            if (rawResult) {
                const { id: imageRecordID, uploadURL } = rawResult;
                const res = await axios.post(uploadURL, data, {
                    timeout: 30000,
                    onUploadProgress: function (progressEvent) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );

                        toast.update(toastId.current, {
                            render: t(
                                'modal.change-profile-picture.uploading-image'
                            ),
                            closeOnClick: false,
                            progress:
                                (40 + Math.round(percentCompleted / 2.5)) / 100,
                        });

                        console.log(percentCompleted);
                    },
                });

                if (res.data?.success) {
                    toast.update(toastId.current, {
                        render: t(
                            'modal.change-profile-picture.updating-profile'
                        ),
                        closeOnClick: false,
                        progress: 0.8,
                    });

                    let updateProfileProgress = 0;
                    const updateProfileInterval = setInterval(() => {
                        updateProfileProgress++;
                        toast.update(toastId.current, {
                            render: t(
                                'modal.change-profile-picture.updating-profile'
                            ),
                            closeOnClick: false,
                            progress: (80 + updateProfileProgress) / 100,
                        });

                        if (updateProfileProgress >= 20) {
                            clearInterval(updateProfileInterval);
                        }
                    }, 10);

                    await SurrealQuery<TKardsUserDetails>(
                        `UPDATE user SET picture = ${imageRecordID}`
                    );

                    clearInterval(updateProfileInterval);
                    return true;
                } else {
                    toast.update(toastId.current, {
                        progress: 0,
                        icon: null,
                        autoClose: 5000,
                        closeOnClick: true,
                        render: t(
                            'modal.change-profile-picture.image-upload-failed'
                        ),
                        type: toast.TYPE.ERROR,
                    });
                }
            } else {
                toast.update(toastId.current, {
                    progress: 0,
                    icon: null,
                    autoClose: 5000,
                    closeOnClick: true,
                    render: t(
                        'modal.change-profile-picture.url-request-failed'
                    ),
                    type: toast.TYPE.ERROR,
                });
            }
        })().then((success) => {
            setIsUploading(false);

            if (success) {
                setTimeout(() => {
                    setBlob(null);
                    setUploaded(null);
                }, 250);

                onClose();
                refreshUserDetails();

                toast.update(toastId.current, {
                    progress: 0,
                    icon: null,
                    autoClose: 5000,
                    closeOnClick: true,
                    render: t('modal.change-profile-picture.picture-updated'),
                    type: toast.TYPE.SUCCESS,
                });
            }
        });
    };

    const removePicture = async (e: MouseEvent) => {
        e.preventDefault();

        await SurrealQuery(`UPDATE user SET picture = NONE`);
        setTimeout(() => {
            setBlob(null);
            setUploaded(null);
        }, 250);

        onClose();
        refreshUserDetails();

        toast.success(t('modal.change-profile-picture.picture-removed'));
    };

    return (
        <div {...getRootProps()}>
            <Modal
                show={show}
                title={t<string>('modal.change-profile-picture.title')}
                onClose={onClose}
                className={styles.modal}
            >
                <div
                    className={[
                        styles.uploadingOverlay,
                        isUploading ? styles.showUploadingOverlay : 0,
                    ]
                        .filter((a) => !!a)
                        .join(' ')}
                >
                    <Spinner color="Light" size={100} />
                </div>
                <input {...getInputProps()} />
                {!uploaded && (
                    <div onClick={open} className={styles.unselected}>
                        <p>{t('modal.change-profile-picture.drag-zone')}</p>
                    </div>
                )}

                {uploaded && (
                    <div className="selected">
                        <div className={styles.preview}>
                            {refresh && (
                                <CropProfilePicture
                                    file={uploaded}
                                    setBlob={setBlob}
                                />
                            )}

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
                        <div className={styles.buttons}>
                            <ButtonLarge
                                text={t<string>(
                                    'modal.change-profile-picture.save-picture'
                                )}
                                onClick={saveImage}
                                icon={<SaveIcon />}
                                disabled={isUploading}
                            />
                            <ButtonLarge
                                text={t<string>('common:change')}
                                onClick={open}
                                icon={<RotateCwIcon />}
                                disabled={isUploading}
                            />
                        </div>
                    </div>
                )}

                <a
                    href="#"
                    className={styles.removeLink}
                    onClick={removePicture}
                >
                    {t('modal.change-profile-picture.remove-picture')}
                </a>
            </Modal>
        </div>
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

            // Credit where due: https://stackoverflow.com/a/5100158
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
