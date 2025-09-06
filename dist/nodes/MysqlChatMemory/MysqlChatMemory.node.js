"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlChatMemory = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const MysqlChatMessageHistory_1 = require("./MysqlChatMessageHistory");
const MemoryOptionsDescription_1 = require("./descriptions/MemoryOptionsDescription");
class MysqlChatMemory {
    constructor() {
        this.description = {
            displayName: 'MySQL Chat Memory',
            name: 'mysqlChatMemory',
            icon: 'file:mysql.svg',
            group: ['transform'],
            version: [1, 1.1],
            description: 'Use MySQL as chat memory for AI agents',
            defaults: {
                name: 'MySQL Chat Memory',
            },
            codex: {
                categories: ['AI'],
                subcategories: {
                    AI: ['Memory'],
                },
            },
            inputs: [n8n_workflow_1.NodeConnectionTypes.Main],
            outputs: [n8n_workflow_1.NodeConnectionTypes.AiMemory],
            outputNames: ['Memory'],
            credentials: [
                {
                    name: 'mysqlChatMemory',
                    required: true,
                },
            ],
            properties: [
                {
                    displayName: 'Table Name',
                    name: 'tableName',
                    type: 'string',
                    default: 'chat_memory',
                    description: 'Name of the table to store chat history',
                },
                {
                    displayName: 'Session ID',
                    name: 'sessionId',
                    type: 'string',
                    default: '={{ $json.sessionId }}',
                    description: 'The key to use to store the memory',
                    required: true,
                    displayOptions: {
                        show: {
                            '@version': [1],
                        },
                    },
                },
                {
                    displayName: 'Session ID',
                    name: 'sessionId',
                    type: 'string',
                    default: '={{ $json.sessionId }}',
                    description: 'The key to use to store the memory',
                    displayOptions: {
                        show: {
                            '@version': [1.1],
                        },
                    },
                },
                {
                    displayName: 'Context Window Length',
                    name: 'contextWindowLength',
                    type: 'number',
                    default: 5,
                    description: 'Number of previous interactions to consider for context',
                    displayOptions: {
                        show: {
                            '@version': [1.1],
                        },
                    },
                },
                ...MemoryOptionsDescription_1.memoryOptions,
            ],
        };
    }
    async supplyData(itemIndex) {
        const credentials = await this.getCredentials('mysqlChatMemory');
        const nodeVersion = this.getNode().typeVersion;
        const sessionId = this.getNodeParameter('sessionId', itemIndex);
        const tableName = this.getNodeParameter('tableName', itemIndex, 'chat_memory');
        // Создаем историю сообщений MySQL
        const chatHistory = new MysqlChatMessageHistory_1.MysqlChatMessageHistory({
            credentials,
            sessionId,
            tableName,
        });
        // Создаем объект памяти с нужными методами
        const memory = {
            chatHistory,
            memoryKey: 'chat_history',
            returnMessages: true,
            inputKey: 'input',
            outputKey: 'output',
            // Реализуем необходимые методы
            async loadMemoryVariables(_values) {
                const messages = await chatHistory.getMessages();
                return {
                    [this.memoryKey]: this.returnMessages ? messages : messages.map(m => m.content).join('\n'),
                };
            },
            async saveContext(inputValues, outputValues) {
                // Сохраняем входное сообщение
                await chatHistory.addMessage({
                    _type: 'human',
                    content: inputValues[this.inputKey || 'input'],
                });
                // Сохраняем выходное сообщение
                await chatHistory.addMessage({
                    _type: 'ai',
                    content: outputValues[this.outputKey || 'output'],
                });
            },
            async clear() {
                await chatHistory.clear();
            }
        };
        return {
            response: memory,
        };
    }
    async execute() {
        const credentials = await this.getCredentials('mysqlChatMemory');
        const items = this.getInputData();
        const returnData = [];
        // Проверяем опции
        const options = this.getNodeParameter('options', 0);
        const tableName = this.getNodeParameter('tableName', 0, 'chat_memory');
        if (options.clearHistory) {
            const chatHistory = new MysqlChatMessageHistory_1.MysqlChatMessageHistory({
                credentials,
                sessionId: options.sessionIdToClear || 'default',
                tableName,
            });
            try {
                if (options.sessionIdToClear) {
                    // Очищаем конкретную сессию
                    await chatHistory.clear();
                    returnData.push({ json: { success: true, message: `Cleared history for session: ${options.sessionIdToClear}` } });
                }
                else {
                    // Очищаем текущую сессию
                    const sessionId = this.getNodeParameter('sessionId', 0, 'default');
                    chatHistory['sessionId'] = sessionId;
                    await chatHistory.clear();
                    returnData.push({ json: { success: true, message: `Cleared history for session: ${sessionId}` } });
                }
            }
            catch (error) {
                returnData.push({ json: { success: false, error: error.message } });
            }
            finally {
                await chatHistory.close();
            }
        }
        else {
            // Если нет опций очистки, просто возвращаем успех
            returnData.push({ json: { success: true, message: 'No action performed' } });
        }
        return [this.helpers.returnJsonArray(returnData)];
    }
}
exports.MysqlChatMemory = MysqlChatMemory;
//# sourceMappingURL=MysqlChatMemory.node.js.map