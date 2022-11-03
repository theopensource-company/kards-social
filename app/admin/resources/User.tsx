import React, { useState } from 'react';
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
    Show,
    TabbedShowLayout,
    Tab,
    ShowButton,
    useRecordContext,
    Create,
    ListContextProvider,
    useGetManyReference,
    useList,
    Pagination,
} from 'react-admin';
import { TableHead, TableRow, TableCell } from '@mui/material';

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

const UserTitle = () => {
    const ctx = useRecordContext();
    return (
        <>
            {ctx ? `User: ${ctx.name}` : "Loading"}
        </>
    );
}

export const ShowUser = () => {
    return (
        <Show title={<UserTitle />}>
            <TabbedShowLayout>
                <Tab label="details">
                    <TextField source="id" />
                    <TextField source="name" />
                    <TextField source="username" />
                    <EmailField source="email" />
                    <DateField source="created" />
                    <DateField source="updated" />
                </Tab>
                <Tab label="events">
                    <ShowUserEvents />
                </Tab>
            </TabbedShowLayout>
        </Show>
    );
}

export const ShowUserEvents = () => {
    const ctx = useRecordContext();
    const [perPage, setPerPage] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const events = useGetManyReference('event', {
        target: 'field',
        id: ctx.id,
        pagination: { page, perPage },
        sort: { field: 'created', order: 'DESC' }
    });

    const Header = () => (
        <TableHead>
            <TableRow>
                <TableCell />
                <TableCell>Id</TableCell>
                <TableCell>Event</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
            </TableRow>
        </TableHead>
    );

    return (
        <ListContextProvider value={useList(events)}>
            <Datagrid isRowSelectable={() => false} header={<Header />}>
                <TextField source="id" />
                <TextField source="event" />
                <TextField source="from" />
                <TextField source="to" />
            </Datagrid>
            <Pagination rowsPerPageOptions={[10, 25, 50, 100]} perPage={perPage} setPerPage={setPerPage} page={page} setPage={setPage} total={events.total}  />
        </ListContextProvider>
    );
};


export const EditUser = () => (
    <Edit title={<UserTitle />}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="name" />
            <TextInput source="username" />
            <TextInput source="email" type="email" />
            <TextInput source="password" type="password" label="New password" />
        </SimpleForm>
    </Edit>
);

export const CreateUser = () => (
    <Create>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="username" />
            <TextInput source="email" type="email" />
            <TextInput source="password" type="password" label="Password" />
        </SimpleForm>
    </Create>
);

export const UserResource = <Resource name="user" list={UserList} edit={EditUser} show={ShowUser} create={CreateUser} />;
