export const AccountSidebarItems = [
    {
        icon: 'User',
        title: 'Profile',
        description: 'Manage your account & profile details',
        key: 'profile',
        link: '/account',
    },
    {
        icon: 'Shield',
        title: 'Security',
        description: 'Password and Multi-factor authentication',
        key: 'security',
        link: '/account/security',
    },
    {
        icon: 'Server',
        title: 'Privacy',
        description: 'Publicity of your profile and how we manage your data',
        key: 'privacy',
        link: '/account/privacy',
    },
] as const;

export type AccountSidebarItem = typeof AccountSidebarItems[number]['key'];
