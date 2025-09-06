import { INodeProperties } from 'n8n-workflow';

export const memoryOptions: INodeProperties[] = [
    {
	displayName: 'Options',
	name: 'options',
	type: 'collection',
	placeholder: 'Add Option',
	default: {},
	options: [
	    {
		displayName: 'Clear History',
		name: 'clearHistory',
		type: 'boolean',
		default: false,
		description: 'Whether to clear the chat history',
	    },
	    {
		displayName: 'Session ID to Clear',
		name: 'sessionIdToClear',
		type: 'string',
		default: '',
		description: 'Session ID to clear (leave empty to use current session)',
		displayOptions: {
		    show: {
			clearHistory: [true],
		    },
		},
	    },
	],
    },
];