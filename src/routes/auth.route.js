import express from 'express';

import { signin } from '#src/controllers/signin.js';
import { signup } from '#src/controllers/signup.js';
import { verifyEmail } from '#src/controllers/verify-email.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.put('/verify-email', verifyEmail);

export default router;
