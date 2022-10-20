import React from "react";
import { List, Datagrid, TextField, EmailField, Resource } from "react-admin";

export const UserList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="username" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);

export const UserResource = <Resource name="user" list={UserList} />;
