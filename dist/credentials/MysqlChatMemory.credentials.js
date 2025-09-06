"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlChatMemory = void 0;
class MysqlChatMemory {
    constructor() {
        this.name = 'mysqlChatMemory';
        this.displayName = 'MySQL Chat Memory';
        this.properties = [
            {
                displayName: 'Host',
                name: 'host',
                type: 'string',
                default: 'localhost',
            },
            {
                displayName: 'Database',
                name: 'database',
                type: 'string',
                default: '',
            },
            {
                displayName: 'User',
                name: 'user',
                type: 'string',
                default: 'root',
            },
            {
                displayName: 'Password',
                name: 'password',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
            },
            {
                displayName: 'Port',
                name: 'port',
                type: 'number',
                default: 3306,
            },
        ];
    }
}
exports.MysqlChatMemory = MysqlChatMemory;
//# sourceMappingURL=MysqlChatMemory.credentials.js.map