const express = require('express');
const path = require("path");
const fs = require("fs");
const cors = require("cors");
require("dotenv").config();

const dinoRoutes = require("./routes/dinos");
const favoritesRoutes = require("./routes/favorites");

const app = express();
const PORT = process.env.PORT || 3000;
const clientBuildPath = path.join(__dirname, "client", "dist");
const clientIndexPath = path.join(clientBuildPath, "index.html");
const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        callback(null, !origin || allowedOrigins.includes(origin));
    },
}));
app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use("/api/dinos", dinoRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api", (req, res) => {
    res.status(404).json({ error: "Not Found" });
});

app.use(express.static(clientBuildPath));
app.use((req, res, next) => {
    if (req.method === "GET" && fs.existsSync(clientIndexPath)) {
        return res.sendFile(clientIndexPath);
    }
    return next();
});

app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
});

app.use((err, req, res, next) => {
    console.error("Unhandled request error:", err);
    if (res.headersSent) {
        return next(err);
    }
    return res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})