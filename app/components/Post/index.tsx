import React from 'react';
import Image from 'next/image';

import styles from '../../styles/components/Post.module.scss';
import { StaticImageData } from 'next/image';

import Linkify from 'react-linkify';
import Link from 'next/link';
import ProfilePreview from '../Profile/ProfilePreview';

type Props = {
    image: string | StaticImageData;
    caption: string | React.ReactNode;
};

class InvalidPostError extends Error {}

/* eslint-disable-next-line unused-imports/no-unused-vars */
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

    const classes = [styles.default].filter((a) => !!a).join(' ');

    return (
        <div className={classes}>
            <div className={styles.images}>
                <Image fill={true} src={image} alt={'Image'} />
            </div>
            <div className={styles.postInfo}>
                <div className={styles.author}>
                    <ProfilePreview
                        showName={true}
                        showUsername={true}
                        showProfilePicture={true}
                        profile={{
                            username: 'kards',
                            name: 'Kards',
                            description:
                                'The open source, no non-sense social media.',
                            website: 'https://www.kards.social/',
                            created: new Date(),
                        }}
                    />
                </div>
                <div className={styles.caption}>
                    <Linkify componentDecorator={LinkComponent}>
                        {caption}
                    </Linkify>
                </div>
                <div className={styles.comments}></div>
            </div>
        </div>
    );
}
