import React, { forwardRef, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TFormInput } from '../../constants/Types';
import styles from '../../styles/components/form/InputField.module.scss';

export const FormInputField = forwardRef<HTMLInputElement, TFormInput>(
    (
        {
            color,
            tint,
            noBorder,
            className,
            size,
            labelClassName,
            label,
            id: defaultId,
            ...rest
        },
        ref
    ) => {
        if (!size) size = 'Large';
        const [id, setId] = useState(defaultId ?? '');
        useEffect(
            () => setId(defaultId ?? `kards:formitem:${uuidv4()}`),
            [setId, defaultId]
        );

        const inputClasses = [
            styles.default,
            color
                ? styles[`color${color}${tint ? `Tint${tint}` : ''}`]
                : tint
                ? styles[`tint${tint}`]
                : '',
            noBorder ? styles.noBorder : 0,
            styles[`size${size}`],
            className,
        ]
            .filter((a) => !!a)
            .join(' ');

        const labelClasses = [
            styles.label,
            styles[`labelSize${size}`],
            labelClassName,
        ]
            .filter((a) => !!a)
            .join(' ');

        return (
            <>
                {label && (
                    <label htmlFor={id} className={labelClasses}>
                        {label}
                    </label>
                )}
                <input className={inputClasses} id={id} ref={ref} {...rest} />
            </>
        );
    }
);

FormInputField.displayName = 'FormInputField';
