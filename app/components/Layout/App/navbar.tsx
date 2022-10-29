import React from "react";
import { LogoSmall } from "../../Logo";
import styles from "../../../styles/components/layout/App/Navbar.module.scss";
import { useDelayedRefreshAuthenticatedUser, useIsAuthenticated } from "../../../hooks/KardsUser";
import Link from "next/link";
import { SurrealQuery, SurrealSignout } from "../../../lib/Surreal";
import { ButtonSmall } from "../../Button";

export default function AppLayoutNavbar() {
    const authenticated = useIsAuthenticated();
    const refreshUserDetails = useDelayedRefreshAuthenticatedUser();

    return (
        <div className={styles.navbar}>
            <LogoSmall className={styles.logo} />
            <div>
                {authenticated ? (
                    <>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            SurrealSignout().then(() => {
                                refreshUserDetails();

                                setTimeout(() => {
                                    SurrealQuery("SELECT * FROM user");
                                }, 1000)
                            });
                        }}>
                            Signout
                        </a>
                        <Link href="/account">
                            <a>
                                Account
                            </a>
                        </Link>
                        
                    </>
                ): (
                    <>
                        <Link href="/auth/signin">
                            <ButtonSmall text="Signin" />
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}