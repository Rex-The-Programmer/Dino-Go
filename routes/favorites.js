const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT dinos.id, dinos.name, dinos.diet, dinos.image_url FROM favorites JOIN dinos ON dinos.id = favorites.dino_id ORDER BY dinos.name ASC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error('GET /api/favorites failed', err);
        res.status(501).json({ error: "GET /api/favorites is not built yet (Phase 2)" });

    }
});;

router.post("/:dinoId", async (req, res) => {
    const dinoId = parseInt(req.params.dinoId, 10)

    if (Number.isNaN(dinoId)) {
        return res.status(400).json({ error: 'Dino id must be a number' });
    }

    try {
        const dinoCheck = await pool.query('SELECT id FROM dinos WHERE id = $1', [dinoId]);
        if (dinoCheck.rows.length === 0) {
            return res.status(404).json({ error: 'Dino not found'});
        }

        const result = await pool.query('INSERT INTO favorites (dino_id) VALUES ($1) RETURNING *',
            [dinoId]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Dino is already favorited'});
        }
        console.error('POST /api/favorites/:dinoId failed', err);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});

router.delete("/:dinoId", async (req, res) => {
    const dinoId = parseInt(req.params.dinoId, 10);

    if (Number.isNaN(dinoId)) {
        return res.status(400).json({ error: 'Dino id must be a number'}) 
    }

    try {
        const result = await pool.query('DELETE FROM favorites WHERE dino_id = $1 RETURNING *', [dinoId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Favorite not found'});
        } 
        res.status(204).send();
    } catch (err) {
        console.error('DELETE /api/favorites/:dinoId failed', err);
        res.status(500).json({ error: 'Internal Server Error'});
    }
});

module.exports = router;