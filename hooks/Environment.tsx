import React, {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from 'react';
import {
    TFeatureFlagOptions,
    TFeatureFlags,
    FeatureFlagOptions,
} from '../constants/Types';
import { featureFlags } from '../lib/Environment';

export const FeatureFlagContext = createContext<TFeatureFlags>(featureFlags);

export const FeatureFlagProvider = ({ children }: { children: ReactNode }) => {
    const [state, setState] = useState<TFeatureFlags>(featureFlags);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('kfflags') ?? '{}');
        const parsed = Object.keys(stored).reduce<TFeatureFlags>(
            (prev, curr) => ({
                ...prev,
                ...(FeatureFlagOptions.includes(curr as TFeatureFlagOptions) &&
                typeof stored[curr] == 'boolean'
                    ? {
                          [curr]: stored[curr],
                      }
                    : {}),
            }),
            featureFlags
        );

        setState(parsed);
    }, [setState]);

    return (
        <FeatureFlagContext.Provider value={state}>
            {children}
        </FeatureFlagContext.Provider>
    );
};

export const useFeatureFlag = (flag: TFeatureFlagOptions): boolean => {
    const fflags = useContext(FeatureFlagContext);
    return fflags[flag];
};

export const useFeatureFlags = (): TFeatureFlags => {
    const fflags = useContext(FeatureFlagContext);
    return fflags;
};

export const WithFeatureFlag = ({
    flag,
    children,
}: {
    flag: TFeatureFlagOptions;
    children: ReactNode;
}) => {
    const value = useFeatureFlag(flag);
    return <>{value ?? children}</>;
};

export const WithoutFeatureFlag = ({
    flag,
    children,
}: {
    flag: TFeatureFlagOptions;
    children: ReactNode;
}) => {
    const value = useFeatureFlag(flag);
    return <>{!value ?? children}</>;
};
