import React, { useEffect, useState } from "react";
import { TKardsUserDetails } from "../constants/Types";
import { UserDetails } from "../lib/KardsUser";

export const useUserDetails = (): {
    isReady: boolean;
    result: TKardsUserDetails | null;
} => {
    const [isReady, setReady] = useState<boolean>(false);
    const [result, setResult] = useState<TKardsUserDetails | null>(null);

    useEffect(() => {
        UserDetails().then(setResult).finally(() => setReady(true));
    }, []);

    return {
        isReady,
        result
    };
}