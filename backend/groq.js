require("dotenv").config();
const OpenAI = require("openai");

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", // ← Groq baseURL
});

const textToMongoQuery = async (question, schema, history = []) => {
  const systemPrompt = `You are a MongoDB expert assistant.
Given this database schema:
${schema}

Convert the user's question into a MongoDB query object.
Return ONLY valid JSON, no explanation, no markdown:
{
  "collection": "collectionName",
  "operation": "find" | "aggregate" | "count",
  "filter": {},
  "projection": {},
  "sort": {},
  "limit": 20,
  "pipeline": []
}

Important rules:
- For nested fields use dot notation e.g. "shippingAddress.city"
- For array fields use e.g. "items.price"
- Always include a limit
- Only use collections and fields that exist in the schema`;

  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile", // ← Groq model
    messages: [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: question },
    ],
    temperature: 0,
    max_tokens: 800,
  });

  const raw = response.choices[0].message.content.trim();
  const clean = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(clean);
  } catch (err) {
    throw new Error(`Groq returned invalid JSON: ${clean}`);
  }
};

const resultsToAnswer = async (question, results) => {
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `The user asked: "${question}"
Results: ${JSON.stringify(results.slice(0, 10))}

Reply in 1-2 simple sentences like you are talking to a normal user.
No technical terms, no mention of documents, collections, queries or JSON.
Just answer the question directly and naturally.`,
      },
    ],
    max_tokens: 200,
  });

  return response.choices[0].message.content;
};

module.exports = { textToMongoQuery, resultsToAnswer };
