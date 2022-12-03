import React from 'react';

import LayoutContentMiddle from '../../components/Layout/ContentMiddle';
import Post from '../../components/Post';

import Example from '../../assets/image/example.jpg';

export default function Feed() {
    return (
        <LayoutContentMiddle>
            <Post
                image={Example}
                caption="This is a caption. https://example.com/"
            />
        </LayoutContentMiddle>
    );
}
