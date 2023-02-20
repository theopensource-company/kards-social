import { ReactNode } from 'react';
import * as Feather from 'react-feather';
import { AccountSidebarItem } from '../AccountSidebar';

export type TPageLayout = {
    title?: string;
    description?: string;
    robots?: string;
    children: ReactNode;
};

export type TPageLayoutContentMiddle = TPageLayout & {
    containerClassName?: string;
};

export type TPageLayoutAccount = TPageLayout & {
    activeKey: AccountSidebarItem;
};

export type TAccountSidebarItem = {
    icon: keyof typeof Feather;
    title: string;
    description: string;
    key: string;
    link: `/account${string}`;
    active?: boolean;
};
