const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();

app.use(cors({
  origin: "https://roblox-updater.github.io"
}));

function getJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

app.get("/v1/api/getimgfromunid", async (req, res) => {
  try {
    let g = "";
    let start = true;
    for (const [key, value] of Object.entries(req.query)) {
      g += start ? `?${key}=${value}` : `&${key}=${value}`;
      start = false;
    }

    if (!req.query.isCircular) {
      g += start ? "?isCircular=false" : "&isCircular=false";
    }

    const url = `https://thumbnails.roblox.com/v1/games/icons${g}`;

    const data = await getJSON(url);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

app.get("/", async (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/v1/api/gametext", async (req, res) => {
  try {
    let g = "";
    let start = true;
    for (const [key, value] of Object.entries(req.query)) {
      g += start ? `?${key}=${value}` : `&${key}=${value}`;
      start = false;
    }

    const url = `https://games.roblox.com/v1/games${g}`;

    const data = await getJSON(url);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message || "Server error" });
  }
});

app.listen(3000, () => console.log('Server running on 3000'));
