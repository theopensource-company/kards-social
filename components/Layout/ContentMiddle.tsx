import React from 'react';
import Layout from '.';

import { TPageLayoutContentMiddle } from '../../constants/Types/Page.types';
import styles from '../../styles/components/layout/ContentMiddle.module.scss';

export default function ContentMiddle({
    children,
    containerClassName,
    ...props
}: TPageLayoutContentMiddle) {
    return (
        <Layout {...props}>
            <div
                className={[styles.container, containerClassName]
                    .filter((a) => !!a)
                    .join(' ')}
            >
                {children}
            </div>
        </Layout>
    );
}
