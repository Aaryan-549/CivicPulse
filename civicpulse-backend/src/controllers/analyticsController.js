import prisma from '../config/database.js';
import { formatResponse } from '../utils/helpers.js';

export const getHeatmapData = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = {};
    if (status && status !== 'All') {
      where.status = status;
    }

    const complaints = await prisma.complaint.findMany({
      where,
      select: {
        id: true,
        category: true,
        subcategory: true,
        latitude: true,
        longitude: true,
        status: true,
        address: true,
        createdAt: true
      }
    });

    const heatmapPoints = complaints.map(c => ({
      id: c.id,
      lat: c.latitude,
      lng: c.longitude,
      status: c.status,
      category: c.category,
      subcategory: c.subcategory,
      address: c.address,
      date: c.createdAt
    }));

    res.json(formatResponse(true, heatmapPoints, 'Heatmap data retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalComplaints,
      pendingComplaints,
      inProgressComplaints,
      resolvedComplaints,
      rejectedComplaints,
      totalUsers,
      totalWorkers,
      activeWorkers
    ] = await Promise.all([
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: 'Pending' } }),
      prisma.complaint.count({ where: { status: 'In-Progress' } }),
      prisma.complaint.count({ where: { status: 'Resolved' } }),
      prisma.complaint.count({ where: { status: 'Rejected' } }),
      prisma.user.count(),
      prisma.worker.count(),
      prisma.worker.count({ where: { status: 'Active' } })
    ]);

    const categoryBreakdown = await prisma.complaint.groupBy({
      by: ['category'],
      _count: { category: true },
      orderBy: {
        _count: { category: 'desc' }
      }
    });

    const typeBreakdown = await prisma.complaint.groupBy({
      by: ['type'],
      _count: { type: true }
    });

    const recentComplaints = await prisma.complaint.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, name: true }
        },
        worker: {
          select: { id: true, name: true }
        },
        media: {
          select: { url: true }
        }
      }
    });

    const stats = {
      overview: {
        totalComplaints,
        totalUsers,
        totalWorkers,
        activeWorkers
      },
      complaintsByStatus: {
        pending: pendingComplaints,
        inProgress: inProgressComplaints,
        resolved: resolvedComplaints,
        rejected: rejectedComplaints
      },
      complaintsByCategory: categoryBreakdown.map(c => ({
        category: c.category,
        count: c._count.category
      })),
      complaintsByType: typeBreakdown.map(t => ({
        type: t.type,
        count: t._count.type
      })),
      recentComplaints
    };

    res.json(formatResponse(true, stats, 'Dashboard statistics retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getTrendsData = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const complaints = await prisma.complaint.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
        status: true,
        category: true
      },
      orderBy: { createdAt: 'asc' }
    });

    const dailyStats = complaints.reduce((acc, complaint) => {
      const date = complaint.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { date, total: 0, pending: 0, inProgress: 0, resolved: 0 };
      }
      acc[date].total++;
      if (complaint.status === 'Pending') acc[date].pending++;
      if (complaint.status === 'In-Progress') acc[date].inProgress++;
      if (complaint.status === 'Resolved') acc[date].resolved++;
      return acc;
    }, {});

    const trends = Object.values(dailyStats);

    res.json(formatResponse(true, trends, 'Trends data retrieved successfully'));
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.complaint.groupBy({
      by: ['category', 'subcategory'],
      _count: { category: true },
      orderBy: {
        _count: { category: 'desc' }
      }
    });

    const categoriesMap = categories.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = {
          category: item.category,
          totalCount: 0,
          subcategories: []
        };
      }
      acc[item.category].totalCount += item._count.category;
      acc[item.category].subcategories.push({
        name: item.subcategory,
        count: item._count.category
      });
      return acc;
    }, {});

    const result = Object.values(categoriesMap);

    res.json(formatResponse(true, result, 'Categories retrieved successfully'));
  } catch (error) {
    next(error);
  }
};
