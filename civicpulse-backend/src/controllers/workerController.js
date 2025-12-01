import prisma from '../config/database.js';
import { formatResponse } from '../utils/helpers.js';

export const getAllWorkers = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status) where.status = status;

    const workers = await prisma.worker.findMany({
      where,
      include: {
        complaints: {
          where: {
            status: { in: ['Pending', 'In-Progress'] }
          },
          select: { id: true, category: true, status: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    res.json(formatResponse(true, workers, 'Workers retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getWorkerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const worker = await prisma.worker.findUnique({
      where: { id },
      include: {
        complaints: {
          include: {
            user: { select: { id: true, name: true } },
            media: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!worker) {
      return res.status(404).json(formatResponse(false, null, 'Worker not found'));
    }

    res.json(formatResponse(true, worker, 'Worker retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const createWorker = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    const existingWorker = await prisma.worker.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    });

    if (existingWorker) {
      return res.status(400).json(formatResponse(false, null, 'Email or phone already registered'));
    }

    const worker = await prisma.worker.create({
      data: {
        name,
        email,
        phone,
        status: 'Active'
      }
    });

    res.status(201).json(formatResponse(true, worker, 'Worker created successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status } = req.body;

    const worker = await prisma.worker.findUnique({
      where: { id }
    });

    if (!worker) {
      return res.status(404).json(formatResponse(false, null, 'Worker not found'));
    }

    const updatedWorker = await prisma.worker.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
        ...(status && { status })
      }
    });

    res.json(formatResponse(true, updatedWorker, 'Worker updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateWorkerStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['Active', 'Inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json(formatResponse(false, null, 'Invalid status'));
    }

    const worker = await prisma.worker.update({
      where: { id },
      data: { status }
    });

    res.json(formatResponse(true, worker, 'Worker status updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const getWorkerComplaints = async (req, res, next) => {
  try {
    const { id } = req.params;

    const worker = await prisma.worker.findUnique({
      where: { id }
    });

    if (!worker) {
      return res.status(404).json(formatResponse(false, null, 'Worker not found'));
    }

    const complaints = await prisma.complaint.findMany({
      where: { workerId: id },
      include: {
        user: { select: { id: true, name: true, phone: true } },
        media: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(formatResponse(true, complaints, 'Worker complaints retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
