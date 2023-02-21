import { KeyboardEvent } from 'react';
import {
    FieldPath,
    FieldValues,
    Path,
    PathValue,
    UseFormGetValues,
    UseFormSetValue,
} from 'react-hook-form';

export type TValidationSections = {
    match: RegExp;
    allowed: RegExp;
    onFail: (key: string) => string | void;
}[];

export function keypressValidation<
    TFieldValues extends FieldValues = FieldValues,
    THTMLElement extends HTMLElement = HTMLElement
>(
    getValues: UseFormGetValues<TFieldValues>,
    setValue: UseFormSetValue<TFieldValues>,
    field: FieldPath<TFieldValues>,
    sections: TValidationSections
) {
    return (e: KeyboardEvent<THTMLElement>) => {
        if (!e.code.startsWith(e.key)) {
            e.preventDefault();
            const previousValue = getValues()[field];
            const currentValue = previousValue + e.key;
            const section = sections.find((v) => v.match.test(previousValue));

            if (section && !section.allowed.test(e.key)) {
                const corrected = section.onFail(e.key);
                if (corrected) {
                    setValue(
                        field,
                        (previousValue + corrected) as PathValue<
                            TFieldValues,
                            Path<TFieldValues>
                        >
                    );
                }
            } else {
                setValue(
                    field,
                    currentValue as PathValue<TFieldValues, Path<TFieldValues>>
                );
            }
        }
    };
}
