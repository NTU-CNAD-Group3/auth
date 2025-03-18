import bcrypt from 'bcrypt';

import { getUserByEmail, signToken } from '@/services/auth.service.js';

export async function signin(req, res, next) {
  const { email, password } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    return next(new Error('Invalid credentials'));
  }

  const passwordsMatch = bcrypt.compareSync(password, user.password);
  if (!passwordsMatch) {
    return next(new Error('Invalid credentials'));
  }

  const userJWT = signToken(user.id, user.email, user.username, user.role);
  const userData = {
    email: user.email,
    username: user.username,
    id: user.id,
    provider: user.provider,
    role: user.role,
  };

  res.status(200).json({ message: 'User login successfully', user: userData, jwt: userJWT });
}
