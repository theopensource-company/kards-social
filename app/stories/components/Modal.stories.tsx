import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Modal from '../../components/Modal';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Components/Modal',
    component: Modal,
} as unknown as ComponentMeta<typeof Modal>;

type TemplateArgs = Parameters<typeof Modal>[0];

const Template: ComponentStory<(args: TemplateArgs) => JSX.Element> = (
    args
) => {
    return (
        <Modal
            {...{
                ...args,
            }}
        />
    );
};

export const ExampleModal = Template.bind({});
ExampleModal.args = {
    children: <span>Well hello there!</span>,
};
