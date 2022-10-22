import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    Resource,
    DateField,
} from 'react-admin';

export const UserList = () => (
    <List sort={{ field: 'created', order: 'DESC' }}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="username" />
            <EmailField source="email" />
            <DateField source="created" />
            <DateField source="updated" />
        </Datagrid>
    </List>
);

export const UserResource = <Resource name="user" list={UserList} />;
