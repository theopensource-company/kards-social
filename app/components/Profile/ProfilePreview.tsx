import * as React from 'react';
import Image from 'next/image';

import { TKardsProfile } from '../../constants/Types';
import styles from '../../styles/components/ProfilePreview.module.scss';
import KardsSampleLogo from '../../public/images/icon_128x128.png';

export default function Profile({
    showUsername = true,
    showName = true,
    showProfilePicture = true,
    profile,
}: {
    showUsername?: boolean;
    showName?: boolean;
    showProfilePicture?: boolean;
    profile: TKardsProfile;
}) {
    const classes = [styles.default].filter((a) => !!a).join(' ');

    return (
        <div className={classes}>
            {showProfilePicture && (
                <div className={styles.profilePicture}>
                    <Image
                        fill={true}
                        src={KardsSampleLogo}
                        alt={profile.name}
                    />
                </div>
            )}

            {(showUsername || showName) && (
                <div className={styles.names}>
                    {showName && (
                        <span className={styles.name}>{profile.name}</span>
                    )}
                    {showUsername && (
                        <span className={styles.username}>
                            @{profile.username}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
