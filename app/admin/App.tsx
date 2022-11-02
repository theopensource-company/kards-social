import * as React from "react";
import Fetcher from "./Fetcher";
import { Admin } from "react-admin";
import { UserResource } from "./resources/User";
import authProvider from "./Auth";
import { WaitlistResource } from "./resources/Waitlist";
import { AdminResource } from "./resources/Admin";
import { EventResource } from "./resources/Event";

const App = () => (
  <Admin dataProvider={Fetcher()} authProvider={authProvider}>
    {UserResource}
    {WaitlistResource}
    {AdminResource}
    {EventResource}
  </Admin>
);

export default App;
