# AgentAI with RAG

一个侧重前端交互的全栈 RAG（Retrieval-Augmented Generation，检索增强生成）应用。用户可以上传 PDF 文档并针对文档内容提问；后端会检索与问题相关的文本片段，再调用 OpenAI 模型生成回答。项目还提供可选的 MCP + SerpAPI 联网搜索，以及语音输入和语音播报功能。

## 功能

- 点击或拖拽上传 PDF 文档
- 基于 PDF 内容进行 RAG 问答
- 使用 OpenAI Embeddings 生成文本向量
- 使用内存向量数据库检索相关文档片段
- 使用 OpenAI 模型生成简洁回答
- 可选的 MCP + SerpAPI 联网搜索回答
- 支持浏览器语音输入和回答朗读
- 分开展示文档回答与联网搜索回答
- API 调用失败时在页面中显示错误信息

## 技术栈

### 前端

- React 18
- Ant Design
- Axios
- React Speech Recognition
- Speak TTS

### 后端

- Node.js
- Express
- LangChain
- OpenAI
- MCP SDK
- Multer
- PDF Parse
- SerpAPI（可选）

## 工作流程

```text
上传 PDF
   ↓
读取并拆分文档
   ↓
OpenAI Embeddings 生成向量
   ↓
MemoryVectorStore 保存并检索相关片段
   ↓
相关文档片段 + 用户问题
   ↓
OpenAI 模型生成 RAG 回答
```

如果配置了 `SERPAPI_KEY`，后端还会启动本地 MCP Server，通过 SerpAPI 搜索网络内容，再由 OpenAI 模型总结为联网回答。

## 运行要求

- Node.js 18 或更高版本
- npm
- OpenAI API Key
- SerpAPI Key（可选，仅用于联网搜索）

OpenAI API Key 可以在 [OpenAI Platform](https://platform.openai.com/api-keys) 创建。请妥善保存密钥，不要把 `.env` 文件提交到 GitHub。

## 安装与启动

### 1. 克隆项目

```bash
git clone https://github.com/<your-github-username>/AgentAI_withRAG.git
cd AgentAI_withRAG
```

如果项目已经在本地，可以直接进入项目根目录。

### 2. 安装前端依赖

```bash
npm install
```

### 3. 安装后端依赖

```bash
cd server
npm install
cd ..
```

也可以在项目根目录执行：

```bash
npm install --prefix server
```

### 4. 创建上传目录

上传的 PDF 不会提交到 GitHub，因此首次运行时需要创建目录。

PowerShell：

```powershell
New-Item -ItemType Directory -Force server/uploads
```

macOS / Linux：

```bash
mkdir -p server/uploads
```

### 5. 配置环境变量

在 `server` 目录下新建 `.env` 文件：

```dotenv
OPENAI_API_KEY=your_openai_api_key

# 可选：启用 MCP 联网搜索
SERPAPI_KEY=your_serpapi_key
```

`OPENAI_API_KEY` 是 PDF RAG 问答的必要配置。`SERPAPI_KEY` 未配置时，文档问答仍然可以使用，但联网搜索功能会被跳过。

### 6. 同时启动前端和后端

在项目根目录执行：

```bash
npm run dev
```

启动成功后访问：

- 前端：http://localhost:3000
- 后端：http://localhost:5001

### 分别启动前端和后端

如果需要单独查看日志，可以打开两个终端。

终端一（后端）：

```bash
cd server
npm start
```

终端二（前端）：

```bash
npm start
```

不要同时运行 `npm run dev` 和 `server` 目录中的 `npm start`，否则后端端口 `5001` 会发生冲突。

## 使用方法

1. 打开 http://localhost:3000。
2. 点击上传区域或将 PDF 拖入页面。
3. 等待页面提示文件上传成功。
4. 在底部输入框中输入与文档相关的问题。
5. 查看 `RAG Answer` 中基于 PDF 生成的回答。
6. 如果配置了 SerpAPI，查看 `MCP Answer` 中的联网搜索回答。

> 每次启动服务后，请先上传 PDF，再开始提问。

## 可用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 同时启动 React 前端和 Express 后端 |
| `npm start` | 只启动 React 前端 |
| `npm run server` | 只启动后端 |
| `npm run build` | 构建生产版本前端 |
| `npm test` | 运行前端测试 |

## 项目结构

```text
AgentAI_withRAG/
├── public/                       # React 静态资源
├── src/
│   ├── components/
│   │   ├── ChatComponent.js      # 文字/语音提问
│   │   ├── PdfUploader.js        # PDF 上传
│   │   └── RenderQA.js           # 回答展示
│   └── App.js                    # 前端主页面
├── server/
│   ├── chat.js                   # PDF 解析、向量检索与 RAG
│   ├── chat-mcp.js               # MCP 搜索结果总结
│   ├── mcp-server.js             # SerpAPI MCP Server
│   ├── server.js                 # Express 服务和 API 路由
│   └── uploads/                  # 本地上传文件，不提交到 Git
├── package.json
└── README.md
```

## API

### 上传 PDF

```http
POST /upload
Content-Type: multipart/form-data
```

文件字段名为 `file`。

### 文档问答

```http
GET /chat?question=<your-question>
```

返回示例：

```json
{
  "ragAnswer": "Answer generated from the uploaded document.",
  "mcpAnswer": "Answer generated from web search, or a disabled message."
}
```

## 常见问题

### 上传 PDF 失败

- 确认后端已在 `5001` 端口运行。
- 确认 `server/uploads` 目录存在。
- 查看后端终端中的错误信息。

### 页面一直加载或模型请求失败

- 检查 `server/.env` 中的 `OPENAI_API_KEY`。
- 确认 OpenAI API 项目具有可用额度和对应模型的访问权限。
- 修改 `.env` 后需要重启后端。

### `EADDRINUSE: address already in use :::5001`

端口 `5001` 已被另一个后端进程占用。关闭之前运行的 `npm start` 或 `npm run dev` 终端，然后重新启动项目。

### MCP 联网搜索不可用

在 `server/.env` 中配置有效的 `SERPAPI_KEY` 并重启后端。未配置时不会影响 PDF RAG 问答。

## 安全说明

- 不要将 `server/.env` 或任何 API Key 提交到 GitHub。
- 不要提交 `server/uploads` 中可能含有个人信息的 PDF。
- 如果密钥曾公开，请立即撤销并生成新密钥。
- OpenAI API 调用会产生费用，请关注账户用量和限额。

## 说明

当前向量数据保存在内存中，服务重启后不会持久化。系统会在提问时处理当前上传的 PDF，适合用于学习、演示和小规模原型开发。
