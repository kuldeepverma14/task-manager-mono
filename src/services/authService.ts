import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../db/prisma';
import { BadRequestError, UnauthorizedError } from '../utils/errors';
import { registerSchema, loginSchema } from '../validations/auth';
import { JWT_CONFIG } from '../config/jwt';

export const registerUser = async (data: any) => {
  const validated = registerSchema.parse(data);

  const existingUser = await prisma.user.findUnique({ where: { email: validated.email } });
  if (existingUser) throw BadRequestError('Email already registered.');

  const hashedPassword = await bcrypt.hash(validated.password, 10);

  const user = await prisma.user.create({
    data: {
      email: validated.email,
      password: hashedPassword,
      name: validated.name,
    },
  });

  return { id: user.id, email: user.email, name: user.name };
};

export const loginUser = async (data: any) => {
  const validated = loginSchema.parse(data);

  const user = await prisma.user.findUnique({ where: { email: validated.email } });
  if (!user) throw UnauthorizedError('Invalid credentials.');

  const isMatch = await bcrypt.compare(validated.password, user.password);
  if (!isMatch) throw UnauthorizedError('Invalid credentials.');

  const accessToken = jwt.sign({ userId: user.id }, JWT_CONFIG.SECRET, { expiresIn: JWT_CONFIG.EXPIRE } as any);
  const refreshToken = jwt.sign({ userId: user.id }, JWT_CONFIG.REFRESH_SECRET, { expiresIn: JWT_CONFIG.REFRESH_EXPIRE } as any);

  // Multiple sessions support: add refresh token to list
  await prisma.user.update({
    where: { id: user.id },
    data: { refreshTokens: { push: refreshToken } },
  });

  return {
    user: { id: user.id, email: user.email, name: user.name },
    accessToken,
    refreshToken,
  };
};

export const refreshUserToken = async (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.REFRESH_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user || !user.refreshTokens.includes(token)) {
      throw UnauthorizedError('Invalid refresh token.');
    }

    // Generate new pair
    const accessToken = jwt.sign({ userId: user.id }, JWT_CONFIG.SECRET, { expiresIn: JWT_CONFIG.EXPIRE } as any);
    const newRefreshToken = jwt.sign({ userId: user.id }, JWT_CONFIG.REFRESH_SECRET, { expiresIn: JWT_CONFIG.REFRESH_EXPIRE } as any);

    // Replace old token with new one (Token rotation)
    const updatedTokens = user.refreshTokens.filter((t: string) => t !== token);
    updatedTokens.push(newRefreshToken);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshTokens: updatedTokens },
    });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw UnauthorizedError('Invalid or expired refresh token.');
  }
};

export const logoutUser = async (token: string, userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (user) {
     const updatedTokens = user.refreshTokens.filter((t: string) => t !== token);
     await prisma.user.update({
         where: { id: userId },
         data: { refreshTokens: updatedTokens }
     });
  }
};
