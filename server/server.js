import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});
console.log("Groq key loaded:", process.env.GROQ_API_KEY);

app.post("/ask", async (req, res) => {

  try {

    const { message, systemPrompt } = req.body;

    const completion = await groq.chat.completions.create({
      model:  "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    res.json({
      content: [
        {
          text: completion.choices[0].message.content
        }
      ]
    });

  } catch (error) {

   

  console.error("GROQ FULL ERROR:", error);

  res.status(500).json({
    error: error.message || "Groq request failed"
  });


  }

});

app.listen(3000, () => {
  console.log("Groq AI server running on port 3000");
});