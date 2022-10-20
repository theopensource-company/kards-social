import React from "react";
import { List, Datagrid, TextField, EmailField, Resource } from "react-admin";

export const AdminList = () => (
  <List>
    <Datagrid>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
    </Datagrid>
  </List>
);

export const AdminResource = <Resource name="admin" list={AdminList} />;
