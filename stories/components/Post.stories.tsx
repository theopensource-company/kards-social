import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import Post from '../../components/Post';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Components/Post',
    component: Post,
} as unknown as ComponentMeta<typeof Post>;

type TemplateArgs = Parameters<typeof Post>[0];

const Template: ComponentStory<(args: TemplateArgs) => JSX.Element> = (
    args
) => {
    return (
        <Post
            {...{
                ...args,
            }}
        />
    );
};

export const ExamplePost = Template.bind({});
ExamplePost.args = {
    image: '/images/example.jpg',
    caption: 'This is an example caption. https://www.example.com/',
};
