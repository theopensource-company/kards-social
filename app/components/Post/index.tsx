import React from 'react';
import Image from 'next/image';

import styles from '../../styles/components/Post.module.scss';
import { StaticImageData } from 'next/image';

import Linkify from 'react-linkify';
import Link from 'next/link';

type Props = {
    image: string | StaticImageData;
    caption: string | React.ReactNode;
};

class InvalidPostError extends Error {}

const LinkComponent = (href: string, text: string, key: number) => (
    <Link href={href} key={key} target="_blank">
        {text}
    </Link>
);

export default function Post({ image, caption }: Props) {
    if (!image || !caption)
        throw new InvalidPostError(
            "The post didn't have a caption or image associated."
        );

    const classes = [styles.default]
        .filter((a) => !!a)
        .join(' ');

    return (
        <div className={classes}>
            <div className={styles.images}></div>
            <div className={styles.post}>
                <div className={styles.author}></div>
                <div className={styles.caption}></div>
                <div className={styles.comments}></div>
            </div>
        </div>
    );
}
