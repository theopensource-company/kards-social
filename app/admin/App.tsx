import * as React from "react";
import Fetcher from "./Fetcher";
import { Admin } from "react-admin";
import { UserResource } from "./resources/User";
import authProvider from "./Auth";
import { WaitlistResource } from "./resources/Waitlist";
import { AdminResource } from "./resources/Admin";

const App = () => (
  <Admin dataProvider={Fetcher()} authProvider={authProvider}>
    {UserResource}
    {WaitlistResource}
    {AdminResource}
  </Admin>
);

export default App;
