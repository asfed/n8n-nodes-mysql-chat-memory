import { BaseListChatMessageHistory } from '@langchain/core/chat_history';
import { BaseMessage, AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { createPool } from 'mysql2/promise';

interface MysqlChatMessageHistoryArgs {
    credentials: any;
    sessionId: string;
    tableName?: string;
}

export class MysqlChatMessageHistory extends BaseListChatMessageHistory {
    lc_namespace = ["n8n-nodes-mysql-chat-memory", "mysql", "chat_history"];
    
    private pool: any;
    public sessionId: string;
    private tableName: string;

    constructor(private readonly args: MysqlChatMessageHistoryArgs) {
	super();
	this.sessionId = args.sessionId;
	this.tableName = args.tableName || 'chat_memory';
	
	this.pool = createPool({
	    host: args.credentials.host,
	    user: args.credentials.user,
	    password: args.credentials.password,
	    database: args.credentials.database,
	    port: args.credentials.port,
	});
	
	// Создаем таблицу при инициализации
	this.createTableIfNotExists().catch(console.error);
    }

    private async createTableIfNotExists() {
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

    public async getMessages(): Promise<BaseMessage[]> {
	try {
	    const [rows]: any = await this.pool.query(
		`SELECT role, content FROM \`${this.tableName}\` WHERE session_id = ? ORDER BY created_at ASC`,
		[this.sessionId]
	    );

	    return rows.map((row: any) => {
		switch (row.role) {
		    case 'ai':
			return new AIMessage({ content: row.content });
		    case 'human':
			return new HumanMessage({ content: row.content });
		    case 'system':
			return new SystemMessage({ content: row.content });
		    default:
			return new HumanMessage({ content: row.content });
		}
	    });
	} catch (error: any) {
	    throw new Error(`Failed to load messages: ${error.message}`);
	}
    }

    public async addMessage(message: any): Promise<void> {
	try {
	    let role = 'human';
	    if (message._type === 'ai') {
		role = 'ai';
	    } else if (message._type === 'system') {
		role = 'system';
	    }

	    await this.pool.query(
		`INSERT INTO \`${this.tableName}\` (session_id, role, content) VALUES (?, ?, ?)`,
		[this.sessionId, role, message.content]
	    );
	} catch (error: any) {
	    throw new Error(`Failed to save message: ${error.message}`);
	}
    }

    public async clear(): Promise<void> {
	try {
	    await this.pool.query(
		`DELETE FROM \`${this.tableName}\` WHERE session_id = ?`,
		[this.sessionId]
	    );
	} catch (error: any) {
	    throw new Error(`Failed to clear messages: ${error.message}`);
	}
    }

    public async close(): Promise<void> {
	if (this.pool) {
	    await this.pool.end();
	}
    }
}