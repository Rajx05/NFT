// import express from "express";
// import fetch from "node-fetch";
// import dotenv from "dotenv";

// dotenv.config();
// const app = express();
// const PORT = 3000;

// app.use(express.static("public")); // HTML + JS folder

// app.get("/api/nfts", async (req, res) => {
//   const owner = req.query.owner;
//   if (!owner) return res.status(400).json({ error: "Missing ?owner=0x..." });

//   try {
//     const response = await fetch(`https://api.opensea.io/api/v1/assets?owner=${owner}&limit=12`, {
//       headers: { "X-API-KEY": process.env.OPENSEA_KEY }
//     });
//     const data = await response.json();
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
