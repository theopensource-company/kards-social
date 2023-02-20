import {
    FeatureFlagOptions,
    TEnvironment,
    TFeatureFlagOptions,
    TFeatureFlags,
} from '../constants/Types';

export const Environment = (process.env.NEXT_PUBLIC_ENV ??
    'prod') as TEnvironment;
const featureFlagDefaults: {
    [key in TEnvironment | 'any']: {
        [key in TFeatureFlagOptions]?: boolean;
    };
} = {
    prod: {
        preLaunchPage: true,
    },
    dev: {
        devTools: true,
    },
    any: {},
};

const featureFlagFromEnv = (flag: TFeatureFlagOptions): boolean | void => {
    if (process.env[`NEXT_PUBLIC_FFLAG_${flag.toUpperCase()}`])
        return (
            process.env[`NEXT_PUBLIC_FFLAG_${flag.toUpperCase()}`] != 'false'
        );
};

const featureFlagDefault = (flag: TFeatureFlagOptions): boolean => {
    const envFlag = featureFlagDefaults[Environment][flag];
    const anyFlag = featureFlagDefaults['any'][flag];
    if (envFlag) return envFlag;
    if (anyFlag) return anyFlag;
    return false;
};

export const featureFlags: TFeatureFlags = [...FeatureFlagOptions].reduce(
    (prev, flag) => ({
        ...prev,
        [flag]: featureFlagFromEnv(flag) ?? featureFlagDefault(flag),
    }),
    {}
) as TFeatureFlags;
