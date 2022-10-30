import React, { ReactNode } from "react";
import { TFeatureFlagOptions } from "../constants/Types";
import { featureFlags } from "../lib/Environment";

export const useFeatureFlag = (flag: TFeatureFlagOptions): boolean => featureFlags[flag];
export const WithFeatureFlag = ({
    flag,
    children
}: {
    flag: TFeatureFlagOptions,
    children: ReactNode
}) => (
    <>
        {featureFlags[flag] ?? children}
    </>
);

export const WithoutFeatureFlag = ({
    flag,
    children
}: {
    flag: TFeatureFlagOptions,
    children: ReactNode
}) => (
    <>
        {!featureFlags[flag] ?? children}
    </>
);