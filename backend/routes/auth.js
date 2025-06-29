import express from 'express';
const router = express.Router();
import { login, register } from '../controllers/authcontroller.js';

router.get('/login', login);
router.post('/register', register);

export default router;
