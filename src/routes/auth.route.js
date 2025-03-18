import express from 'express';

import { signin } from '@/controllers/signin.js';
import { signup } from '@/controllers/signup.js';
import { verifyEmail } from '@/controllers/verify-email.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/verify-email', verifyEmail);

export default router;
