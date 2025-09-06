"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlChatMessageHistory = void 0;
const chat_history_1 = require("@langchain/core/chat_history");
const messages_1 = require("@langchain/core/messages");
const promise_1 = require("mysql2/promise");
class MysqlChatMessageHistory extends chat_history_1.BaseListChatMessageHistory {
    constructor(args) {
        super();
        this.args = args;
        this.lc_namespace = ["n8n-nodes-mysql-chat-memory", "mysql", "chat_history"];
        this.sessionId = args.sessionId;
        this.tableName = args.tableName || 'chat_memory';
        this.pool = (0, promise_1.createPool)({
            host: args.credentials.host,
            user: args.credentials.user,
            password: args.credentials.password,
            database: args.credentials.database,
            port: args.credentials.port,
        });
        // Создаем таблицу при инициализации
        this.createTableIfNotExists().catch(console.error);
    }
    async createTableIfNotExists() {
        const createTableQuery = `
	    CREATE TABLE IF NOT EXISTS \`${this.tableName}\` (
		id INT AUTO_INCREMENT PRIMARY KEY,
		session_id VARCHAR(128) NOT NULL,
		role VARCHAR(50) NOT NULL,
		content TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		INDEX idx_session_id (session_id)
	    )
	`;
        await this.pool.query(createTableQuery);
    }
    async getMessages() {
        try {
            const [rows] = await this.pool.query(`SELECT role, content FROM \`${this.tableName}\` WHERE session_id = ? ORDER BY created_at ASC`, [this.sessionId]);
            return rows.map((row) => {
                switch (row.role) {
                    case 'ai':
                        return new messages_1.AIMessage({ content: row.content });
                    case 'human':
                        return new messages_1.HumanMessage({ content: row.content });
                    case 'system':
                        return new messages_1.SystemMessage({ content: row.content });
                    default:
                        return new messages_1.HumanMessage({ content: row.content });
                }
            });
        }
        catch (error) {
            throw new Error(`Failed to load messages: ${error.message}`);
        }
    }
    async addMessage(message) {
        try {
            let role = 'human';
            if (message._type === 'ai') {
                role = 'ai';
            }
            else if (message._type === 'system') {
                role = 'system';
            }
            await this.pool.query(`INSERT INTO \`${this.tableName}\` (session_id, role, content) VALUES (?, ?, ?)`, [this.sessionId, role, message.content]);
        }
        catch (error) {
            throw new Error(`Failed to save message: ${error.message}`);
        }
    }
    async clear() {
        try {
            await this.pool.query(`DELETE FROM \`${this.tableName}\` WHERE session_id = ?`, [this.sessionId]);
        }
        catch (error) {
            throw new Error(`Failed to clear messages: ${error.message}`);
        }
    }
    async close() {
        if (this.pool) {
            await this.pool.end();
        }
    }
}
exports.MysqlChatMessageHistory = MysqlChatMessageHistory;
//# sourceMappingURL=MysqlChatMessageHistory.js.map