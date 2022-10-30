import { FeatureFlagOptions, TEnvironment, TFeatureFlagOptions, TFeatureFlags } from "../constants/Types";

const environment = (process.env.NEXT_PUBLIC_ENV ?? 'prod') as TEnvironment;
const defaults: {
    [key in TEnvironment | 'any']: {
        [key in TFeatureFlagOptions]?: boolean;
    }
} = {
    prod: {
        preLaunchPage: true
    },
    dev: {

    },
    any: {

    }
};

const featureFlagFromEnv = (flag: TFeatureFlagOptions): boolean | void => {
    if (process.env[`NEXT_PUBLIC_FFLAG_${flag.toUpperCase()}`]) return process.env[`NEXT_PUBLIC_FFLAG_${flag.toUpperCase()}`] != 'false';
}

const featureFlagDefault = (flag: TFeatureFlagOptions): boolean => {
    const envFlag = defaults[environment][flag];
    const anyFlag = defaults['any'][flag];
    if (envFlag) return envFlag;
    if (anyFlag) return anyFlag;
    return false;
}

export const featureFlags: TFeatureFlags = [...FeatureFlagOptions].reduce((prev, flag) => ({
    ...prev, 
    [flag]: featureFlagFromEnv(flag) ?? featureFlagDefault(flag)
}), {}) as TFeatureFlags;