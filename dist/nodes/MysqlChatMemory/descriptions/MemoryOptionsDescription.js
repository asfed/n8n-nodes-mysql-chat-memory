"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoryOptions = void 0;
exports.memoryOptions = [
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
//# sourceMappingURL=MemoryOptionsDescription.js.map