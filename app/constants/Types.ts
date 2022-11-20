import { HTMLProps, ReactNode } from 'react';
import { BasicColorTintType, BasicColorType, ColorType } from './Colors';
import * as Feather from 'react-feather';
import { AccountSidebarItem } from './AccountSidebar';

/* ENVIRONMENT */

export type TEnvironment = 'prod' | 'dev';
export const FeatureFlagOptions = ['preLaunchPage'] as const;
export type TFeatureFlagOptions = typeof FeatureFlagOptions[number];

export type TFeatureFlags = {
    [key in TFeatureFlagOptions]: boolean;
};

export type SvgBaseProps = {
    size?: number;
    className?: string;
};

export type ColoredSvgProps = SvgBaseProps & {
    color?: ColorType;
};

/* LAYOUT COMPONENTS */

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

/* KARDS API */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TApiSuccessResponse<TResultType = any> = {
    success: true;
    message?: string;
    result?: TResultType;
};

export type TApiErrorResponse = {
    success: false;
    message: string;
    error: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TApiResponse<TResultType = any> =
    | TApiSuccessResponse<TResultType>
    | TApiErrorResponse;

/* FORM TYPES */

export type TFormItemSize = 'Small' | 'Large';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TFormItem<THTMLElement extends HTMLElement = HTMLElement> = Omit<
    HTMLProps<THTMLElement>,
    'size'
> & {
    labelClassName?: string;
    size?: TFormItemSize;
    label?: string;
    color?: BasicColorType;
    tint?: BasicColorTintType;
    noBorder?: boolean;
    noHover?: boolean;
};

export type TFormItemTheming<TBase extends TFormItem = TFormItem> = Pick<
    TBase,
    | 'className'
    | 'labelClassName'
    | 'size'
    | 'color'
    | 'tint'
    | 'noBorder'
    | 'noHover'
>;

export type TFormInput = Omit<TFormItem<HTMLInputElement>, 'noHover'>;

/* Kards user types */

export type TEmail = `${string}@${string}.${string}`;
export type TKardsUserID = `user:${string}`;
export type TKardsUserDetails = {
    id: TKardsUserID;
    name: `${string} ${string}`; //It's not strict about what comes after it, but this way it must contain at least one space (first & lastname)
    email: TEmail;
    username: string;
    created: Date;
    updated: Date;
};

export type TUpdateKardsUser = {
    name?: `${string} ${string}`; //It's not strict about what comes after it, but this way it must contain at least one space (first & lastname)
    email?: TEmail;
    username?: string;
};

export type TAuthenticateKardsUser = {
    identifier: string;
    password: string;
};

export type TAuthState<T = TKardsUserDetails> = {
    authenticated: boolean;
    details: T | null;
};

/* Admin user types */

export type TAdminUserID = `user:${string}`;
export type TAdminUserDetails = {
    id: TAdminUserID;
    name: `${string} ${string}`; //It's not strict about what comes after it, but this way it must contain at least one space (first & lastname)
    email: TEmail;
    created: Date;
    updated: Date;
};

/* Account sidebar */

export type TAccountSidebarItem = {
    icon: keyof typeof Feather;
    title: string;
    description: string;
    key: string;
    link: `/account${string}`;
    active?: boolean;
};
