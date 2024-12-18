import express from 'express';

const router = express.Router();

router.get('/example', (req, res) => {
    res.status(200).json({ message: "Example route" });
});

export default router;
