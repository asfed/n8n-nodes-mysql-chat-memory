import { ICredentialType, NodePropertyTypes } from 'n8n-workflow';

export class MysqlChatMemory implements ICredentialType {
    name = 'mysqlChatMemory';
    displayName = 'MySQL Chat Memory';
    properties = [
	{
	    displayName: 'Host',
	    name: 'host',
	    type: 'string' as NodePropertyTypes,
	    default: 'localhost',
	},
	{
	    displayName: 'Database',
	    name: 'database',
	    type: 'string' as NodePropertyTypes,
	    default: '',
	},
	{
	    displayName: 'User',
	    name: 'user',
	    type: 'string' as NodePropertyTypes,
	    default: 'root',
	},
	{
	    displayName: 'Password',
	    name: 'password',
	    type: 'string' as NodePropertyTypes,
	    typeOptions: {
		password: true,
	    },
	    default: '',
	},
	{
	    displayName: 'Port',
	    name: 'port',
	    type: 'number' as NodePropertyTypes,
	    default: 3306,
	},
    ];
}