import React from "react";
import { List, Datagrid, TextField, EmailField, Resource } from "react-admin";

export const WaitlistList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);

export const WaitlistResource = (
  <Resource
    name="waitlist"
    list={WaitlistList}
    options={{ label: "Waitlist entries" }}
  />
);
