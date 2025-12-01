import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { formatResponse } from '../utils/helpers.js';

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    });

    if (existingUser) {
      return res.status(400).json(formatResponse(false, null, 'Email or phone already registered'));
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json(formatResponse(true, { user, token }, 'Registration successful'));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json(formatResponse(false, null, 'Invalid credentials'));
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json(formatResponse(false, null, 'Invalid credentials'));
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, type: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone
    };

    res.json(formatResponse(true, { user: userData, token }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json(formatResponse(false, null, 'Invalid credentials'));
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json(formatResponse(false, null, 'Invalid credentials'));
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, type: 'admin', role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const adminData = {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    };

    res.json(formatResponse(true, { admin: adminData, token }, 'Login successful'));
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json(formatResponse(false, null, 'Token required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const newToken = jwt.sign(
      { id: decoded.id, email: decoded.email, type: decoded.type, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json(formatResponse(true, { token: newToken }, 'Token refreshed'));
  } catch (error) {
    next(error);
  }
};
