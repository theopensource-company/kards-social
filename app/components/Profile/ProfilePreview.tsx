import Image from "next/image";

import { TKardsProfile } from "../../constants/Types";
import styles from "../../styles/components/Post.module.scss";
import KardsSampleLogo from "../../public/images/icon_128x128.png";

export default function Profile({
    showUsername = true,
    showName = true,
    showProfilePicture = true,
    profile
}: {
    showUsername: boolean;
    showName: boolean;
    showProfilePicture: boolean;
    profile: TKardsProfile;
}) {

    const classes = [styles.default]
        .filter((a) => !!a)
        .join(' ');

    return (
        <div className={classes}>
            <Image src={KardsSampleLogo} alt={profile.name}></Image>
            {(showUsername || showUsername) && (
                <div className={styles.names}>
                    {showName && <span className={styles.name}></span>}
                    {showUsername && <span className={styles.username}></span>}
                </div>
            )}
        </div>
    );
}