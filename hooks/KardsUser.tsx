import React, {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useEffect,
    useState,
} from 'react';
import { TAuthState, TKardsUser } from '../constants/Types/KardsUser.types';
import { UserDetails } from '../lib/KardsUser';

export const AuthContext = createContext<
    [TAuthState, Dispatch<SetStateAction<TAuthState>>]
>([
    {
        authenticated: false,
        details: null,
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    () => {},
]);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isReady, setReady] = useState<boolean>(false);
    const state = useState<TAuthState>({
        authenticated: false,
        details: null,
    });

    const [, setAuthState] = state;

    useEffect(() => {
        UserDetails()
            .then((user) => {
                setAuthState({
                    authenticated: !!user,
                    details: user,
                });
            })
            .finally(() => setReady(true));
    }, [setAuthState]);

    return (
        <>
            {isReady && (
                <AuthContext.Provider value={state}>
                    {children}
                </AuthContext.Provider>
            )}
        </>
    );
};

export const useRefreshAuthenticatedUser = (): {
    isReady: boolean;
    result: TKardsUser | null;
} => {
    const state = useContext(AuthContext);
    const [isReady, setReady] = useState<boolean>(false);
    const [, setAuthState] = state;

    useEffect(() => {
        UserDetails()
            .then((user) => {
                setAuthState({
                    authenticated: !!user,
                    details: user,
                });
            })
            .finally(() => setReady(true));
    }, [setAuthState]);

    return {
        isReady,
        result: state[0].details,
    };
};

export const useDelayedRefreshAuthenticatedUser = (): (() => {
    isReady: boolean;
    result: TKardsUser | null;
}) => {
    const state = useContext(AuthContext);
    const [isReady, setReady] = useState<boolean>(false);
    const [update, setUpdate] = useState<number>(0);
    const [, setAuthState] = state;

    useEffect(() => {
        if (update > 0)
            UserDetails()
                .then((user) => {
                    setAuthState({
                        authenticated: !!user,
                        details: user,
                    });
                })
                .finally(() => setReady(true));
    }, [update, setAuthState]);

    return () => {
        setUpdate(update + 1);
        return {
            isReady,
            result: state[0].details,
        };
    };
};

export const useAuthState = (): TAuthState => {
    return useContext(AuthContext)[0];
};

export const useIsAuthenticated = (): boolean => {
    return useContext(AuthContext)[0].authenticated;
};

export const useAuthenticatedUser = (): TKardsUser | null => {
    return useContext(AuthContext)[0].details;
};
