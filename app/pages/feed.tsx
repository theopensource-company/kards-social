import * as React from 'react';

import Post from '../components/Post';

import styles from '../styles/pages/Feed.module.scss';

import ExampleImage from '../public/images/example.jpg';

export default function Feed() {
    return (
        <div className={styles.feedWrapper}>
            <Post
                image={ExampleImage}
                caption={`

                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec mollis magna purus, sed varius magna dictum nec. Mauris nec dui sed arcu molestie blandit aliquet a ipsum. Praesent sed lectus hendrerit, vulputate ligula rutrum, posuere turpis. Quisque eros nulla, condimentum a lectus varius, sodales accumsan libero. Praesent sit amet egestas lacus, et varius urna. Fusce a erat augue. Sed vestibulum. `}
            />
        </div>
    );
}
