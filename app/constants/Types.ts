import { FormEvent, ReactNode } from 'react';
import { FormItem } from '../components/Form/FormItem';
import { BasicColorType, ColorType } from './Colors';

export type SvgBaseProps = {
    size?: number;
}

export type ColoredSvgProps = SvgBaseProps & {
    color?: ColorType;
}

/* FORM TYPES */

export type TForm = {
    inputs: FormItem<TFormItem>[];
    children?: ReactNode;
    id?: string;
    className?: string;

    onSubmit: (args: {
        values: {
            // Ideally I'd want to automatically create a type out of the inputs argument but my headache is too big for this rn :D
            [key: string]: any;
        }, 
        faulty: {
            // Ideally I'd want to automatically create a type out of the inputs argument but my headache is too big for this rn :D
            [key: string]: FormItem<TFormItem>;
        }, 
        event: FormEvent<HTMLFormElement>
    }) => any;
}

export type TFormItemSize = "Small" | "Large";
export type TFormItem<TValueType = any> = {
    id?: string;
    name: string;
    className?: string;
    size?: TFormItemSize;
    placeholder?: string;
    color?: BasicColorType;
    default?: TValueType;
    invalidClass?: string;
    isValid?: (value: TValueType) => boolean;
    process?: (value: TValueType) => TValueType;
};

export type TFormInputFieldType = "Email" | "Number" | "Password" | "Tel" | "Text";
export type TFormInput = TFormItem<string> & {
    type?: TFormInputFieldType;
};