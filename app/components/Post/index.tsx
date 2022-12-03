import React, { useState } from 'react';
import Image from 'next/image';

import styles from '../../styles/components/Post.module.scss';
import { StaticImageData } from 'next/image';

import Linkify from 'react-linkify';

type Props = {
    image: string | StaticImageData;
    caption: string | React.ReactNode;
};

class InvalidPostError extends Error {}

export default function Post({ image, caption }: Props) {
    if (!image || !caption)
        throw new InvalidPostError(
            "The post didn't have a caption or image associated."
        );

    const [flipped, setFlipped] = useState<boolean>(false);

    const postClicked = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;

        // If the clicked target is preventing the flip, don't flip.
        if (
            target.getAttribute('data-preventflip') ||
            (target.parentElement &&
                target.parentElement.getAttribute('data-preventflip'))
        )
            return;

        setFlipped(!flipped);
    };

    const classes = [styles.default, flipped ? styles.flipped : null]
        .filter((a) => !!a)
        .join(' ');

    return (
        <div className={classes} onClick={postClicked}>
            <div className={styles.card}>
                <div className={styles.front}>
                    <div className={styles.image}>
                        <Image src={image} alt="" />
                    </div>
                </div>
                <div className={styles.back}>
                    <div className={styles.image}>
                        <Image src={image} alt="" />
                    </div>
                    <span className={styles.caption} data-preventflip={true}>
                        <Linkify>{caption}</Linkify>
                    </span>
                </div>
            </div>
        </div>
    );
}
