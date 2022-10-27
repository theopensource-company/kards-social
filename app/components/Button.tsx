import React, { MouseEventHandler } from 'react';
import Image from 'next/image';

import styles from '../styles/Button.module.scss';
import { ColorType } from '../constants/Colors';
import { StaticImageData } from 'next/image';
import Spinner from './icon/Spinner';

export type ButtonSize = 'Small' | 'Large';

type Props = {
    onClick?: MouseEventHandler;
    color?: ColorType;
    size?: ButtonSize;
    text?: string;
    icon?: StaticImageData | React.ReactNode;
    iconAlt?: string;
    iconRound?: boolean;
    loading?: boolean;
};

class InvalidButtonError extends Error {}

export default function Button({
    size = 'Large',
    iconRound = false,
    color,
    onClick,
    text,
    icon,
    iconAlt,
    loading = false,
}: Props) {
    if (!text && !icon)
        throw new InvalidButtonError(
            'Neither a button text or icon have been provided.'
        );

    const classes = [
        styles.default,
        color ? styles[`color${color}`] : 0,
        styles[
            `${size.toLowerCase()}${text ? 'Text' : ''}${
                icon || loading ? 'Icon' : ''
            }`
        ],
    ]
        .filter((a) => !!a)
        .join(' ');

    return (
        <button
            className={classes}
            type={onClick ? 'button' : 'submit'}
            onClick={
                onClick
                    ? (event) => {
                          onClick(event);
                      }
                    : undefined
            }
        >
            {(icon || loading) && (
                <div
                    className={[
                        styles[`icon${size}`],
                        iconRound ? styles.iconRound : 0,
                    ]
                        .filter((a) => !!a)
                        .join(' ')}
                >
                    {loading ? (
                        <Spinner />
                    ) : React.isValidElement(icon) ? (
                        icon
                    ) : (
                        <Image
                            src={icon as StaticImageData}
                            alt={iconAlt ?? text ?? 'Button icon'}
                        />
                    )}
                </div>
            )}
            {text && <span>{text}</span>}
        </button>
    );
}

export const ButtonSmall = (config: Props) => {
    return Button({ ...config, size: 'Small' });
};
export const ButtonLarge = (config: Props) => {
    return Button({ ...config, size: 'Large' });
};
