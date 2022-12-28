import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export default function usePasswordValidator() {
    const { t } = useTranslation('hooks');

    return {
        isValidPassword: (values: {
            newpassword: string;
            verifypassword?: string;
        }) => {
            let err;
            const tests = {
                length: values.newpassword.length > 7,
                lowercase: !!/[a-z]/.test(values.newpassword),
                uppercase: !!/[A-Z]/.test(values.newpassword),
                number: !!/[0-9]/.test(values.newpassword),
                special: !!/[^a-zA-Z0-9]/.test(values.newpassword),
            };

            if (Object.values(tests).includes(false)) {
                const missing = Object.keys(tests).filter(
                    (t) => !tests[t as keyof typeof tests]
                );

                err = toast.error(
                    t('field-validation.password.invalid', {
                        criteria:
                            missing
                                .slice(0, -1)
                                .map((a) =>
                                    t(`field-validation.password.test-${a}`)
                                )
                                .join(', ') +
                            (missing.length > 0
                                ? ` ${t('common:and')} ${t(
                                      `field-validation.password.test-${
                                          missing.slice(-1)[0]
                                      }`
                                  )}`
                                : ''),
                    }) as string
                );
            }

            if (
                values.verifypassword !== undefined &&
                values.newpassword !== values.verifypassword
            )
                err = toast.error(t('field-validation.password.no-match'));
            return !err;
        },
    };
}
