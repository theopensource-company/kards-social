import React, { useContext, useEffect } from 'react';
import {
    List,
    Datagrid,
    TextField,
    EmailField,
    Resource,
    DateField,
    Edit,
    SimpleForm,
    TextInput,
    EditButton,
    Show,
    TabbedShowLayout,
    Tab,
    ShowButton,
    useRecordContext,
    useGetList,
    useShowContext,
    useListContext,
    ListContext,
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
            <ShowButton />
        </Datagrid>
    </List>
);

export const ShowUser = () => (
    <Show>
        <TabbedShowLayout>
            <Tab label="details">
                <TextField source="id" />
                <TextField source="name" />
                <TextField source="username" />
                <EmailField source="email" />
                <DateField source="created" />
                <DateField source="updated" />
            </Tab>
        </TabbedShowLayout>
    </Show>
);

export const EditUser = () => (
    <Edit>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <TextInput source="username" />
            <TextInput source="email" type="email" />
            <TextInput source="password" type="password" label="New password" />
        </SimpleForm>
    </Edit>
);

export const UserResource = <Resource name="user" list={UserList} edit={EditUser} show={ShowUser} />;
