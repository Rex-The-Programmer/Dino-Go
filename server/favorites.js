const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    res.status(501).json({ error: "GET /api/favorites is not built yet (Phase 2)" });
});;

router.post("/:dinoId", (req, res) => {
    res.status(501).json({
        error: "POST /api/favorites/:dinoId is not built yet (Phase 2)"
    });
});

router.delete("/:dinoId", (req, res) => {
    res.status(501).json({
        error: "DELETE /api/favorites/:dinoId is not built yet (Phase 2)"
    });
});

module.exports = router;