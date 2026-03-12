require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { extractSchema } = require("./schema");
const { textToMongoQuery, resultsToAnswer } = require("./groq");
const { executeMongoQuery } = require("./executor");

const app = express();
app.use(cors());
app.use(express.json());

// Cache schema after first extraction
let schema;

// Routes
app.use("/api/users", require("./routes/userRoute"));
app.use("/api/products", require("./routes/productRoute"));
app.use("/api/orders", require("./routes/orderRoute"));

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Atlas connected");
    // Extract schema once after connection
    schema = extractSchema();
    // console.log("✅ Schema extracted", schema);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

// Session store for chat history
const sessions = {};

app.post("/api/chat", async (req, res) => {
  const { question, sessionId = "default" } = req.body;

  if (!question) return res.status(400).json({ error: "Question is required" });

  try {
    // Init session history
    if (!sessions[sessionId]) sessions[sessionId] = [];
    const history = sessions[sessionId];

    // Step 1: Text to MongoDB query
    const queryObj = await textToMongoQuery(question, schema, history);

    // Step 2: Execute query
    const results = await executeMongoQuery(queryObj);

    // Step 3: Results to natural language
    const answer = await resultsToAnswer(question, results);

    // Step 4: Update history (keep last 10 turns)
    history.push({ role: "user", content: question });
    history.push({ role: "assistant", content: answer });
    if (history.length > 20) history.splice(0, 2);

    res.json({ answer, query: queryObj, results, rowCount: results.length });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
