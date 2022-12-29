import { useEffect, useState } from 'react';
import { KardsProfileDetails } from '../lib/KardsProfile';
import { TKardsProfile } from '../constants/Types';

export function useKardsProfile(username: string) {
    const [profile, setProfile] = useState<TKardsProfile | null>();

    useEffect(() => {
        KardsProfileDetails(username).then(setProfile);
    }, [username, setProfile]);

    return {
        loading: typeof profile == 'undefined',
        profile,
    };
}
