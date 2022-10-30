import { FormEvent, ReactNode } from "react";
import { FormItem } from "../components/Form/FormItem";
import { BasicColorType, ColorType } from "./Colors";

/* ENVIRONMENT */

export type TEnvironment = 'prod' | 'dev';
export const FeatureFlagOptions = ['preLaunchPage'] as const;
export type TFeatureFlagOptions = typeof FeatureFlagOptions[number];

export type TFeatureFlags = {
  [key in TFeatureFlagOptions]: boolean;
}

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

/* KARDS API */

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

export type TApiResponse<TResultType = any> =
  | TApiSuccessResponse<TResultType>
  | TApiErrorResponse;

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
    };
    faulty: {
      // Ideally I'd want to automatically create a type out of the inputs argument but my headache is too big for this rn :D
      [key: string]: FormItem<TFormItem>;
    };
    event: FormEvent<HTMLFormElement>;
  }) => any;
};

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

export type TFormInputFieldType =
  | "Email"
  | "Number"
  | "Password"
  | "Tel"
  | "Text";
export type TFormInput = TFormItem<string> & {
  type?: TFormInputFieldType;
};

/* Kards user types */

export type TKardsUserID = `user:${string}`;
export type TKardsUserDetails = {
  id: TKardsUserID;
  name: `${string} ${string}`;              //It's not strict about what comes after it, but this way it must contain at least one space (first & lastname)
  email: `${string}@${string}.${string}`;
  username: string;
  created: Date;
  updated: Date;
};

export type TAuthenticateKardsUser = {
  identifier: string;
  password: string;
};

export type TAuthState = {
  authenticated: boolean;
  details: TKardsUserDetails | null;
};