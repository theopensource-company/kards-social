import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import Button from '../../components/Button';
import * as Feather from 'react-feather';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
    title: 'Components/Button',
    component: Button,
    argTypes: {
        icon: {
            options: Object.keys(Feather),
        },
        iconSize: {
            name: 'Icon size',
            type: { name: 'number', required: false },
            defaultValue: 24,
        },
    },
} as unknown as ComponentMeta<typeof Button>;

type TemplateArgs = Omit<Parameters<typeof Button>[0], 'icon'> & {
    iconSize?: number;
    icon?: keyof typeof Feather;
};

const Template: ComponentStory<(args: TemplateArgs) => JSX.Element> = (
    args
) => {
    const Icon = args.icon && Feather[args.icon];

    return (
        <Button
            {...{
                ...args,
                icon: Icon ? <Icon size={args.iconSize} /> : null,
            }}
        />
    );
};

export const LargeText = Template.bind({});
LargeText.args = {
    size: 'Large',
    text: 'Click me!',
};

export const SmallText = Template.bind({});
SmallText.args = {
    size: 'Small',
    text: 'Click me!',
};

export const LargeIcon = Template.bind({});
LargeIcon.args = {
    size: 'Large',
    icon: 'Command',
};

export const SmallIcon = Template.bind({});
SmallIcon.args = {
    size: 'Small',
    icon: 'Command',
    iconSize: 20,
};

export const LargeIconText = Template.bind({});
LargeIconText.args = {
    size: 'Large',
    icon: 'Command',
    text: 'Click me!',
};

export const SmallIconText = Template.bind({});
SmallIconText.args = {
    size: 'Small',
    icon: 'Command',
    text: 'Click me!',
    iconSize: 20,
};
