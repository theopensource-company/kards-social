import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    Resource,
    DateField,
} from 'react-admin';

export const AdminList = () => (
    <List sort={{ field: 'created', order: 'DESC' }}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <EmailField source="email" />
            <DateField source="created" />
            <DateField source="updated" />
        </Datagrid>
    </List>
);

export const AdminResource = <Resource name="admin" list={AdminList} />;
