export const Color = {
    Tint: '#F98C10',

    Light: '#F7F3E3',
    LightTintLight: '#ffffff',
    LightTintLightHover: '#F7F3E3',
    LightTintDark: '#F2EBCF',
    LightTintDarkHover: '#EDE4BF',

    Dark: '#0C1618',
    DarkTintLight: '#152529',
    DarkTintLightHover: '#1C3136',
    DarkTintDark: '#070C0E',
    DarkTintDarkHover: '#000000',

    Transparent: 'transparent',
    TransparentTintLight: 'transparent',
    TransparentTintLightHover: 'transparent',
    TransparentTintDark: 'transparent',
    TransparentTintDarkHover: 'transparent',

    Blue: '#009FF5',
    Red: '#F24236',
    Green: '#1EAE5A',
};

export type BasicColorType = 'Light' | 'Dark';
export type ColorType = 'Tint' | 'Light' | 'Dark' | 'Transparent';
export type OtherColor = 'Blue' | 'Red' | 'Green';
export type ColorTint = keyof Omit<typeof Color, ColorType | OtherColor>;
export type ColorTintType = 'Light' | 'LightHover' | 'Dark' | 'DarkHover';
export type BasicColorTintType = 'Light' | 'Dark';
