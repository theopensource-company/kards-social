import { HTMLProps } from 'react';
import { BasicColorTintType, BasicColorType } from '../Colors';

export type TFormItemSize = 'Small' | 'Large';
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
