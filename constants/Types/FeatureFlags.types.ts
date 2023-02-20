export type TEnv = 'prod' | 'dev';
export const FeatureFlagOptions = ['preLaunchPage', 'devTools'] as const;
export type TFeatureFlagOptions = (typeof FeatureFlagOptions)[number];

export type TFeatureFlags = {
    [key in TFeatureFlagOptions]: boolean;
};
