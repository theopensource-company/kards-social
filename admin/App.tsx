import * as React from 'react';
import { Admin } from 'react-admin';
import authProvider from './Auth';
import Fetcher from './Fetcher';
import { AdminResource } from './resources/Admin';
import { EnvironmentResource } from './resources/Environment';
import { EventResource } from './resources/Event';
import { UserResource } from './resources/User';
import { WaitlistResource } from './resources/Waitlist';

const App = () => (
    <Admin dataProvider={Fetcher()} authProvider={authProvider}>
        {UserResource}
        {WaitlistResource}
        {AdminResource}
        {EnvironmentResource}
        {EventResource}
    </Admin>
);

export default App;
