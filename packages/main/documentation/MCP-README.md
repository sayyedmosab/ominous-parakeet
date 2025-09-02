# MCP (Model Context Protocol) Setup for AI Twin Tech

This project now includes **advanced MCP servers** to dramatically enhance AI assistant capabilities when working on your codebase.

## 🧠 What You Now Have

### **Memory Servers** (The Game Changers!)
- **`mem100x`** - ⚡ Ultra-fast memory server (66k+ entities/sec)
- **`memento`** - 🔍 SQLite + FTS5 + vector search memory  
- **`nova`** - 🎯 Project-specific memory that saves context across sessions

### **Database Servers**
- **`mcp-sqlite`** - 📊 Full SQLite database operations

### **Core Servers**  
- **`filesystem`** - 📁 File operations, reading/writing project files
- **`sequential-thinking`** - 🤔 Complex problem solving and reasoning
- **`inspector`** - 🔍 Debug and monitor MCP connections

## 🚀 How to Connect MCP Servers to Your AI

### **Method 1: VS Code with MCP Extension**
1. Install MCP extension in VS Code
2. Copy `mcp-config.json` content to VS Code MCP settings
3. Restart VS Code

### **Method 2: Claude Desktop**
1. Open: `~/Library/Application Support/Claude/claude_desktop_config.json` (Mac)
2. Or: `%APPDATA%\Claude\claude_desktop_config.json` (Windows)
3. Add this configuration:

```json
{
  "mcpServers": {
    "aitwintech-filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/home/development/aitwintech"]
    },
    "aitwintech-memory": {
      "command": "npx", 
      "args": ["mem100x"]
    },
    "aitwintech-memory-sqlite": {
      "command": "npx",
      "args": ["@iachilles/memento"]
    },
    "aitwintech-database": {
      "command": "npx",
      "args": ["mcp-sqlite", "--db-path", "/home/development/aitwintech/project.db"]
    }
  }
}
```

### **Method 3: Cursor IDE**
1. Go to Cursor Settings → Extensions → MCP
2. Add servers from `mcp-config.json`
3. Enable the servers you want

## 🎯 Quick Start Commands

```bash
# List all available servers
npm run mcp:list

# Start the essential servers
npm run mcp:filesystem    # File access
npm run mcp:memory        # Ultra-fast memory
npm run mcp:database      # SQLite operations
npm run mcp:memory-nova   # Project context memory

# Debug connections
npm run mcp:inspector
```

## 💡 What This Gives You

### **Before MCP:**
- ❌ AI loses context between conversations
- ❌ Limited file access  
- ❌ No project memory
- ❌ Repetitive explanations needed

### **After MCP:**
- ✅ **Persistent Memory** - AI remembers your project details
- ✅ **Full Codebase Access** - AI can read/write any project file
- ✅ **Context Retention** - No more starting from scratch
- ✅ **Database Operations** - AI can query/update SQLite databases
- ✅ **Vector Search** - Semantic search through code and docs
- ✅ **66k+ entities/sec** - Lightning-fast memory operations

## 🔧 Advanced Configuration

### **Memory Server Configuration**
The memory servers will automatically:
- Index your codebase structure
- Remember code patterns and decisions
- Track project evolution
- Store context between AI sessions

### **Database Setup**
```bash
# Initialize project database
npm run mcp:database
```

### **Debugging MCP Connections**
```bash
# Start inspector for debugging
npm run mcp:inspector

# Check server status
./mcp-server.sh list
```

## 🎉 The Result

Once connected, your AI assistant will:
1. **Remember everything** about your React TypeScript project
2. **Access all files** in the codebase instantly  
3. **Maintain context** across sessions
4. **Provide better suggestions** with full project understanding
5. **Never lose track** of complex discussions

This transforms your AI from a **forgetful assistant** into a **persistent coding partner** that grows smarter with every interaction!

## 🚀 Next Steps

1. **Choose your AI client** (VS Code, Claude Desktop, Cursor)
2. **Configure MCP servers** using the instructions above
3. **Start essential servers**: `filesystem`, `memory`, `database`
4. **Test the connection** with a simple query about your project
5. **Experience the difference** - your AI now has project memory!
