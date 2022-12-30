import React from 'react';
import Layout from '../../components/Layout';
import { useKardsProfile } from '../../hooks/KardsProfile';
import { useRouter } from 'next/router';
import Profile from '../../components/Profile/ProfilePreview';

export default function ProfileTemplate() {
    const router = useRouter();
    const { profile, loading } = useKardsProfile(
        typeof router.query.user == 'object'
            ? router.query.user[0]
            : router.query.user || ''
    );

    return (
        <Layout
            title={profile?.name ?? 'Profile not found'}
            description="Check out {{user.name}}'s profile and posts on Kards!"
        >
            {loading && <p>Loading profile</p>}
            {!loading && profile && <Profile profile={profile} />}
            {!loading && !profile && <p>Profile not found</p>}
        </Layout>
    );
}
