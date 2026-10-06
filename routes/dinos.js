const express = require("express");
const pool = require("../db");

const router = express.Router();

const VALID_DIETS = ["carnivore", "herbivore", "omnivore"];


router.get("/", async (req, res) => {
    const { search, diet } = req.query;

    const conditions = [];
    const values = [];

    if (search && search.trim() !== "") {
        values.push(`%${search.trim()}%`);
        conditions.push(`name ILIKE $${values.length}`);
    }

    if (diet && diet !== "all") {
        if (!VALID_DIETS.includes(diet)) {
        return res.status(400).json({
            error: `Invalid diet filter. Must be one of: ${VALID_DIETS.join(", ")}`,
        });
        }
        values.push(diet);
        conditions.push(`diet = $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    try {
        const result = await pool.query(
        `SELECT id, name, diet, image_url, preferred_food FROM dinos ${whereClause} ORDER BY name ASC`,
        values
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching dinos:", err);
        res.status(500).json({ error: "Failed to fetch dinos" });
    }
});

// GET /api/dinos/:id — full detail for the Detail screen
    router.get("/:id", async (req, res) => {
    const { id } = req.params;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({ error: "Dino id must be a number" });
    }

    try {
        const result = await pool.query("SELECT * FROM dinos WHERE id = $1", [id]);

        if (result.rows.length === 0) {
        return res.status(404).json({ error: "Dino not found" });
        }

        const foods = await pool.query(
            "SELECT * FROM taming_foods WHERE dino_id = $1 ORDER BY sort_order",
            [id]
        );

        res.json({ ...result.rows[0], foods: foods.rows });
    } catch (err) {
        console.error("Error fetching dino:", err);
        res.status(500).json({ error: "Failed to fetch dino" });
    }
});

module.exports = router;