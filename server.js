const express = require('express');
const cors = require("cors");
require("dotenv").config();

const dinoRoutes = require("./routes/dinos");
const favoritesRoutes = require("./routes/favorites");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
    })

app.use("/api/dinos", dinoRoutes);
app.use("/api/favorites", favoritesRoutes);

app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})