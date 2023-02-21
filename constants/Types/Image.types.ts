import { ImageProps } from 'next/image';

export type TImageBaseURL = `https://imagedelivery.net/${string}/${string}`;
export const ImageVariant = {
    Loading: 256,
    Small: 256,
    Normal: 512,
    Big: 1024,
    Detail: 10000,
};

export type TImageVariant = keyof typeof ImageVariant;
export type TImage = Omit<ImageProps, 'src' | 'width' | 'height'> & {
    baseURL: TImageBaseURL;
    variant?: TImageVariant;
};
