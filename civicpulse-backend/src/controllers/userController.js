import prisma from '../config/database.js';
import { formatResponse } from '../utils/helpers.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: { complaints: true }
        }
      }
    });

    if (!user) {
      return res.status(404).json(formatResponse(false, null, 'User not found'));
    }

    const userData = {
      ...user,
      totalComplaints: user._count.complaints
    };

    res.json(formatResponse(true, userData, 'Profile retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        _count: {
          select: { complaints: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const usersWithCount = users.map(user => ({
      ...user,
      totalComplaints: user._count.complaints
    }));

    res.json(formatResponse(true, usersWithCount, 'Users retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        complaints: {
          include: {
            media: true,
            worker: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!user) {
      return res.status(404).json(formatResponse(false, null, 'User not found'));
    }

    res.json(formatResponse(true, user, 'User retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getUserComplaintsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id }
    });

    if (!user) {
      return res.status(404).json(formatResponse(false, null, 'User not found'));
    }

    const complaints = await prisma.complaint.findMany({
      where: { userId: id },
      include: {
        media: true,
        worker: {
          select: { id: true, name: true, phone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(formatResponse(true, complaints, 'User complaints retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
