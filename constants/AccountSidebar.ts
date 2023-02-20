// Titles & descriptions can be found in i18n translation files

export const AccountSidebarItems = [
    {
        icon: 'User',
        key: 'profile',
        link: '/account',
    },
    {
        icon: 'Shield',
        key: 'security',
        link: '/account/security',
    },
    {
        icon: 'Server',
        key: 'privacy',
        link: '/account/privacy',
    },
] as const;

export type AccountSidebarItem = (typeof AccountSidebarItems)[number]['key'];
