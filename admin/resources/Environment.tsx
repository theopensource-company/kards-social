import React from 'react';
import {
    Datagrid,
    Edit,
    EditButton,
    List,
    Resource,
    SimpleForm,
    TextField,
    TextInput,
    useRecordContext,
} from 'react-admin';

export const EnvironmentList = () => (
    <List sort={{ field: 'id', order: 'DESC' }}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="value" />
            <EditButton />
        </Datagrid>
    </List>
);

const EnvironmentTitle = () => {
    const ctx = useRecordContext();
    return <>{ctx ? `Key: ${`${ctx.id}`.split(':')[1]}` : 'Loading'}</>;
};

export const EdiTEnv = () => (
    <Edit title={<EnvironmentTitle />}>
        <SimpleForm>
            <TextInput disabled source="id" />
            <TextInput source="value" />
        </SimpleForm>
    </Edit>
);

export const EnvironmentResource = (
    <Resource
        name="environment"
        list={EnvironmentList}
        edit={EdiTEnv}
        options={{ label: 'Environment keys' }}
    />
);
