import i18next from 'i18next';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import * as en_US from './en-US';
import * as nl_NL from './nl-NL';

const resources = {
    'en-US': en_US,
    'nl-NL': nl_NL,
} as const;

i18next
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        detection: {
            // order and from where user language should be detected
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'klang',

            // cache user language on
            caches: ['localStorage'],
        },
        fallbackLng: (code) => {
            if (!code) return 'en-US';
            const language = code.split('-')[0];
            const strict = {
                en: 'en-US',
                nl: 'nl-NL',
            } as const;

            type Tstrict = keyof typeof strict;

            if (code in resources) return code;
            if (language in strict) return strict[language as Tstrict];

            return (
                Object.keys(resources).find(
                    (r) => r.split('-')[0] == language
                ) ?? 'en-US'
            );
        },
        resources,
    });

export { i18n };
