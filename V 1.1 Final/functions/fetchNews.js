const fetch = require("node-fetch");

exports.handler = async (event) => {
  const query = event.queryStringParameters.query;
  const API_KEY = process.env.API_KEY;
  const url = `https://newsapi.org/v2/everything?q=${query}&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch news" }),
    };
  }
};
