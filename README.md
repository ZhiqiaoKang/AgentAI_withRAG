# AgentAI with RAG

AgentAI with RAG is a full-stack, frontend-focused Retrieval-Augmented Generation application. Users can upload a PDF and ask questions about its content. The backend retrieves relevant passages from the document and sends them to an OpenAI model to generate a concise answer. The project also includes optional MCP-powered web search, voice input, and text-to-speech output.

## Features

- Upload PDF documents by clicking or dragging and dropping
- Ask questions grounded in the uploaded PDF
- Generate document embeddings with OpenAI
- Retrieve relevant passages with an in-memory vector store
- Generate concise answers with an OpenAI model
- Optionally search the web through MCP and SerpAPI
- Ask questions using browser-based speech recognition
- Read answers aloud with text-to-speech
- Display document and web-search answers separately
- Display API errors in the user interface

## Tech Stack

### Frontend

- React 18
- Ant Design
- Axios
- React Speech Recognition
- Speak TTS

### Backend

- Node.js
- Express
- LangChain
- OpenAI
- Model Context Protocol SDK
- Multer
- PDF Parse
- SerpAPI (optional)

## How It Works

```text
Upload a PDF
     ↓
Load and split the document
     ↓
Generate vectors with OpenAI Embeddings
     ↓
Store and retrieve passages with MemoryVectorStore
     ↓
Combine relevant passages with the user's question
     ↓
Generate a grounded answer with an OpenAI model
```

When `SERPAPI_KEY` is configured, the backend also starts a local MCP server. The MCP tool searches the web through SerpAPI, and an OpenAI model summarizes the results into a separate web-search answer.

## Prerequisites

- Node.js 18 or later
- npm
- An OpenAI API key
- A SerpAPI key (optional, required only for web search)

Create an API key from the [OpenAI Platform](https://platform.openai.com/api-keys). Keep the key private and never commit the `.env` file to GitHub.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-github-username>/AgentAI_withRAG.git
cd AgentAI_withRAG
```

If the project is already on your computer, open a terminal in the project root instead.

### 2. Install the frontend dependencies

```bash
npm install
```

### 3. Install the backend dependencies

```bash
cd server
npm install
cd ..
```

Alternatively, run the following command from the project root:

```bash
npm install --prefix server
```

### 4. Create the upload directory

Uploaded PDFs are excluded from Git, so you need to create the directory after cloning the repository.

PowerShell:

```powershell
New-Item -ItemType Directory -Force server/uploads
```

macOS or Linux:

```bash
mkdir -p server/uploads
```

### 5. Configure environment variables

Create a `.env` file inside the `server` directory:

```dotenv
OPENAI_API_KEY=your_openai_api_key

# Optional: enables MCP-powered web search
SERPAPI_KEY=your_serpapi_key
```

`OPENAI_API_KEY` is required for PDF embeddings and RAG answers. If `SERPAPI_KEY` is not configured, document-based question answering will still work, but web search will be skipped.

### 6. Start the application

Run the following command from the project root to start both the frontend and backend:

```bash
npm run dev
```

Once the application is running, open:

- Frontend: http://localhost:3000
- Backend: http://localhost:5001

### Start the frontend and backend separately

To view their logs separately, open two terminals.

Terminal 1 — backend:

```bash
cd server
npm start
```

Terminal 2 — frontend:

```bash
npm start
```

Do not run `npm run dev` and `npm start` inside the `server` directory at the same time. Both commands would attempt to start the backend on port `5001`.

## Usage

1. Open http://localhost:3000.
2. Click the upload area or drag a PDF onto it.
3. Wait for the upload success message.
4. Enter a question about the document in the input field.
5. Read the PDF-grounded response under **RAG Answer**.
6. If SerpAPI is configured, read the web result under **MCP Answer**.

> Upload a PDF after every server restart before asking a question.

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the React frontend and Express backend together |
| `npm start` | Starts only the React frontend |
| `npm run server` | Starts only the backend |
| `npm run build` | Creates a production frontend build |
| `npm test` | Runs the frontend test suite |

## Project Structure

```text
AgentAI_withRAG/
├── public/                       # React static assets
├── src/
│   ├── components/
│   │   ├── ChatComponent.js      # Text and voice questions
│   │   ├── PdfUploader.js        # PDF upload interface
│   │   └── RenderQA.js           # Question and answer display
│   └── App.js                    # Main frontend layout
├── server/
│   ├── chat.js                   # PDF parsing, retrieval, and RAG
│   ├── chat-mcp.js               # MCP search-result summarization
│   ├── mcp-server.js             # SerpAPI MCP server
│   ├── server.js                 # Express server and API routes
│   └── uploads/                  # Local uploads excluded from Git
├── package.json
└── README.md
```

## API Endpoints

### Upload a PDF

```http
POST /upload
Content-Type: multipart/form-data
```

The file field must be named `file`.

### Ask a question

```http
GET /chat?question=<your-question>
```

Example response:

```json
{
  "ragAnswer": "Answer generated from the uploaded document.",
  "mcpAnswer": "Answer generated from web search, or a disabled message."
}
```

## Troubleshooting

### PDF upload fails

- Confirm that the backend is running on port `5001`.
- Confirm that the `server/uploads` directory exists.
- Check the backend terminal for an error message.

### The page keeps loading or the model request fails

- Check `OPENAI_API_KEY` in `server/.env`.
- Confirm that the OpenAI API project has available credits and access to the configured model.
- Restart the backend after changing `.env`.

### `EADDRINUSE: address already in use :::5001`

Another backend process is already using port `5001`. Stop the terminal previously running `npm start` or `npm run dev`, then start the project again.

### MCP web search is unavailable

Add a valid `SERPAPI_KEY` to `server/.env` and restart the backend. This setting is optional and does not affect PDF-based RAG answers.

## Security

- Never commit `server/.env` or any API key to GitHub.
- Do not commit PDFs from `server/uploads`, as they may contain private information.
- Revoke and replace any API key that has been exposed.
- OpenAI API requests may incur usage charges, so monitor your usage and account limits.

## Current Limitations

- The vector store is held in memory and is not persisted across server restarts.
- The currently uploaded document is tracked only in server memory.
- The PDF is processed again for each question, which may increase response time and API usage.
- The project is intended primarily for learning, demonstrations, and small prototypes.
