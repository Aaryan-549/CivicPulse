import prisma from '../config/database.js';
import { formatResponse, calculateDistance } from '../utils/helpers.js';
import { uploadImage } from '../services/cloudinaryService.js';
import { validatePlate, validateImage } from '../services/mlService.js';
import { io } from '../index.js';

export const createCivicComplaint = async (req, res, next) => {
  try {
    const { category, subcategory, description, address, latitude, longitude } = req.body;
    const userId = req.user.id;

    let imageUrl = null;
    let imagePublicId = null;

    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.buffer, 'civic-complaints');
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;

        const validation = await validateImage(req.file.buffer);
        if (!validation.valid) {
          console.log('Image validation failed, skipping image upload');
        }
      } catch (error) {
        console.log('Cloudinary upload failed, proceeding without image:', error.message);
      }
    }

    const complaint = await prisma.complaint.create({
      data: {
        type: 'civic',
        category,
        subcategory,
        description,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId,
        validationStatus: 'Approved'
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });

    if (imageUrl) {
      await prisma.media.create({
        data: {
          complaintId: complaint.id,
          url: imageUrl,
          publicId: imagePublicId,
          type: 'image'
        }
      });
    }

    io.emit('complaint:created', {
      complaintId: complaint.id,
      type: complaint.type,
      category: complaint.category,
      status: complaint.status
    });

    res.status(201).json(formatResponse(true, complaint, 'Complaint registered successfully'));
  } catch (error) {
    next(error);
  }
};

export const createTrafficComplaint = async (req, res, next) => {
  try {
    const { category, subcategory, description, address, latitude, longitude, plateNumber } = req.body;
    const userId = req.user.id;

    let imageUrl = null;
    let imagePublicId = null;
    let detectedPlate = null;
    let confidence = 0;
    let validationStatus = 'Pending';

    if (req.file) {
      try {
        const uploadResult = await uploadImage(req.file.buffer, 'traffic-violations');
        imageUrl = uploadResult.secure_url;
        imagePublicId = uploadResult.public_id;

        const mlResult = await validatePlate(req.file.buffer);

        if (mlResult.detected) {
          detectedPlate = mlResult.plate_number;
          confidence = mlResult.confidence;
          validationStatus = confidence >= 0.8 ? 'Approved' : 'Manual Review';
        } else {
          validationStatus = 'Manual Review';
        }
      } catch (error) {
        console.log('Cloudinary/ML service failed, proceeding without image:', error.message);
        validationStatus = 'Manual Review';
      }
    }

    const complaint = await prisma.complaint.create({
      data: {
        type: 'traffic',
        category,
        subcategory,
        description,
        address,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        userId,
        plateNumber: detectedPlate || plateNumber,
        confidenceScore: confidence,
        validationStatus
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        }
      }
    });

    if (imageUrl) {
      await prisma.media.create({
        data: {
          complaintId: complaint.id,
          url: imageUrl,
          publicId: imagePublicId,
          type: 'image'
        }
      });
    }

    io.emit('complaint:created', {
      complaintId: complaint.id,
      type: complaint.type,
      category: complaint.category,
      status: complaint.status,
      plateNumber: complaint.plateNumber,
      validationStatus: complaint.validationStatus
    });

    res.status(201).json(formatResponse(true, complaint, 'Traffic violation registered successfully'));
  } catch (error) {
    next(error);
  }
};

export const getAllComplaints = async (req, res, next) => {
  try {
    const { status, category, type, page = 1, limit = 50 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (type) where.type = type;

    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true }
          },
          worker: {
            select: { id: true, name: true, email: true, phone: true }
          },
          media: true
        },
        orderBy: { createdAt: 'desc' },
        skip: parseInt(skip),
        take: parseInt(limit)
      }),
      prisma.complaint.count({ where })
    ]);

    res.json(formatResponse(true, {
      complaints,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    }, 'Complaints retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getComplaintById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true }
        },
        worker: {
          select: { id: true, name: true, email: true, phone: true }
        },
        media: true,
        statusHistory: {
          orderBy: { timestamp: 'desc' }
        }
      }
    });

    if (!complaint) {
      return res.status(404).json(formatResponse(false, null, 'Complaint not found'));
    }

    res.json(formatResponse(true, complaint, 'Complaint retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getUserComplaints = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    const where = { userId };
    if (status) where.status = status;

    const complaints = await prisma.complaint.findMany({
      where,
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

export const assignWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { workerId } = req.body;
    const adminId = req.admin.id;

    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!complaint) {
      return res.status(404).json(formatResponse(false, null, 'Complaint not found'));
    }

    const worker = await prisma.worker.findUnique({
      where: { id: workerId }
    });

    if (!worker) {
      return res.status(404).json(formatResponse(false, null, 'Worker not found'));
    }

    const oldWorkerId = complaint.workerId;

    const updatedComplaint = await prisma.$transaction(async (tx) => {
      const updated = await tx.complaint.update({
        where: { id },
        data: {
          workerId,
          status: 'In-Progress'
        },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          worker: { select: { id: true, name: true, email: true, phone: true } },
          media: true
        }
      });

      await tx.statusHistory.create({
        data: {
          complaintId: id,
          oldStatus: complaint.status,
          newStatus: 'In-Progress',
          changedBy: adminId
        }
      });

      await tx.worker.update({
        where: { id: workerId },
        data: { assignedCount: { increment: 1 } }
      });

      if (oldWorkerId) {
        await tx.worker.update({
          where: { id: oldWorkerId },
          data: { assignedCount: { decrement: 1 } }
        });
      }

      return updated;
    });

    io.emit('complaint:updated', {
      complaintId: updatedComplaint.id,
      status: updatedComplaint.status,
      userId: updatedComplaint.userId,
      workerId: updatedComplaint.workerId
    });

    res.json(formatResponse(true, updatedComplaint, 'Worker assigned successfully'));
  } catch (error) {
    next(error);
  }
};

export const updateComplaintStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const changedBy = req.admin?.id || req.user?.id;

    const validStatuses = ['Pending', 'In-Progress', 'Resolved', 'Rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json(formatResponse(false, null, 'Invalid status'));
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!complaint) {
      return res.status(404).json(formatResponse(false, null, 'Complaint not found'));
    }

    const updatedComplaint = await prisma.$transaction(async (tx) => {
      const updated = await tx.complaint.update({
        where: { id },
        data: {
          status,
          resolvedAt: status === 'Resolved' ? new Date() : null
        },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          worker: { select: { id: true, name: true, email: true, phone: true } },
          media: true
        }
      });

      await tx.statusHistory.create({
        data: {
          complaintId: id,
          oldStatus: complaint.status,
          newStatus: status,
          changedBy
        }
      });

      if (status === 'Resolved' && complaint.workerId) {
        await tx.worker.update({
          where: { id: complaint.workerId },
          data: { assignedCount: { decrement: 1 } }
        });
      }

      return updated;
    });

    io.emit('complaint:updated', {
      complaintId: updatedComplaint.id,
      status: updatedComplaint.status,
      userId: updatedComplaint.userId
    });

    res.json(formatResponse(true, updatedComplaint, 'Status updated successfully'));
  } catch (error) {
    next(error);
  }
};

export const rejectComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.admin.id;

    const complaint = await prisma.complaint.findUnique({
      where: { id }
    });

    if (!complaint) {
      return res.status(404).json(formatResponse(false, null, 'Complaint not found'));
    }

    const updatedComplaint = await prisma.$transaction(async (tx) => {
      const updated = await tx.complaint.update({
        where: { id },
        data: {
          status: 'Rejected',
          validationStatus: 'Rejected',
          description: reason ? `${complaint.description}\n\nRejection Reason: ${reason}` : complaint.description
        },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          media: true
        }
      });

      await tx.statusHistory.create({
        data: {
          complaintId: id,
          oldStatus: complaint.status,
          newStatus: 'Rejected',
          changedBy: adminId
        }
      });

      if (complaint.workerId) {
        await tx.worker.update({
          where: { id: complaint.workerId },
          data: { assignedCount: { decrement: 1 } }
        });
      }

      return updated;
    });

    io.emit('complaint:updated', {
      complaintId: updatedComplaint.id,
      status: updatedComplaint.status,
      userId: updatedComplaint.userId
    });

    res.json(formatResponse(true, updatedComplaint, 'Complaint rejected successfully'));
  } catch (error) {
    next(error);
  }
};

export const getComplaintsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;

    const complaints = await prisma.complaint.findMany({
      where: { category },
      include: {
        user: { select: { id: true, name: true } },
        worker: { select: { id: true, name: true } },
        media: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(formatResponse(true, complaints, 'Complaints retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getComplaintStats = async (req, res, next) => {
  try {
    const [total, pending, inProgress, resolved, rejected] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'Pending' } }),
      prisma.complaint.count({ where: { status: 'In-Progress' } }),
      prisma.complaint.count({ where: { status: 'Resolved' } }),
      prisma.complaint.count({ where: { status: 'Rejected' } })
    ]);

    const categoryStats = await prisma.complaint.groupBy({
      by: ['category'],
      _count: { category: true }
    });

    res.json(formatResponse(true, {
      total,
      byStatus: { pending, inProgress, resolved, rejected },
      byCategory: categoryStats
    }, 'Statistics retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const deleteComplaint = async (req, res, next) => {
  try {
    const { id } = req.params;

    const complaint = await prisma.complaint.findUnique({
      where: { id },
      include: { worker: true }
    });

    if (!complaint) {
      return res.status(404).json(formatResponse(false, null, 'Complaint not found'));
    }

    await prisma.$transaction(async (tx) => {
      await tx.complaint.delete({
        where: { id }
      });

      if (complaint.workerId && complaint.status !== 'Resolved') {
        await tx.worker.update({
          where: { id: complaint.workerId },
          data: { assignedCount: { decrement: 1 } }
        });
      }
    });

    res.json(formatResponse(true, null, 'Complaint deleted successfully'));
  } catch (error) {
    next(error);
  }
};
