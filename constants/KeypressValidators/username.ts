import { TFunction } from 'i18next';
import { toast } from 'react-toastify';
import { TValidationSections } from '../../lib/KeypressValidation';

export const usernameValidationSections = (
    t: TFunction
): TValidationSections => [
    {
        match: /^$/,
        allowed: /[a-z]/,
        onFail: (k) => {
            if (k && /[a-z]/.test(k.toLowerCase())) return k.toLowerCase();
            toast.info(
                t('constants:keypressValidators.username.start-with-letter')
            );
        },
    },
    {
        match: /^[a-z].*/,
        allowed: /[a-z0-9_\-.]/,
        onFail: (k) => {
            if (k && /[a-z0-9_\-.]/.test(k.toLowerCase()))
                return k.toLowerCase();

            toast.warn(
                t('constants:keypressValidators.username.illegal-character', {
                    char: k,
                })
            );
        },
    },
];
