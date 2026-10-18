import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import chat from "./chat.js";
import chatMCP from "./chat-mcp.js";

dotenv.config();

const app = express();
app.use(cors());

// config multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const PORT = 5001;

let filePath;

app.post("/upload", upload.single("file"), (req, res) => {
  filePath = req.file.path;
  res.send("upload successfully");
});

app.get("/chat", async (req, res) => {
  const question = req.query.question?.trim();

  if (!question) {
    return res.status(400).send({ error: "Please provide a question." });
  }

  try {
    const ragResp = await chat(filePath, question);
    let mcpAnswer = "Web search is disabled because SERPAPI_KEY is not configured.";

    if (process.env.SERPAPI_KEY) {
      const mcpResp = await chatMCP(question);
      mcpAnswer = mcpResp.text;
    }

    return res.send({
      ragAnswer: ragResp.text,
      mcpAnswer,
    });
  } catch (error) {
    console.error("Chat request failed:", error);
    return res.status(500).send({
      error: error?.message || "The model request failed.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
