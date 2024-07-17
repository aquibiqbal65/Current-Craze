import express from "express";
import NewsAPI from "newsapi";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

app.use(cors());

app.get("/api/news", async (req, res) => {
  const query = req.query.q || "India";
  try {
    const response = await newsapi.v2.everything({
      q: query,
      language: "en",
      sortBy: "publishedAt",
    });
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
