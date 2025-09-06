# n8n-nodes-mysql-chat-memory

A custom n8n node that provides persistent chat memory storage using MySQL database, enabling stateful AI/LLM workflows with conversation history.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/asfed/n8n-nodes-mysql-chat-memory.git
cd n8n-nodes-mysql-chat-memory
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Link to your n8n installation or place in custom nodes directory or use N8N_CUSTOM_EXTENSIONS

5. Restart n8n

## Usage

1. Configure MySQL credentials in n8n
2. Add the MySQL Chat Memory node to your workflow
3. Configure session ID and other parameters
4. Use with LLM nodes to maintain conversation state

## License

MIT - see [LICENSE.md](LICENSE.md) for details