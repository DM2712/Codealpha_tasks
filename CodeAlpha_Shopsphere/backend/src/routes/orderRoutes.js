import express from 'express';
import { orderController } from '../controllers/orderController.js';
import { requireAuth, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/orders (supports authenticated customers as well as guest checkout with identifier)
router.post('/', optionalAuth, orderController.createOrder);

// GET /api/orders/my-orders (authenticated user order history)
router.get('/my-orders', optionalAuth, orderController.getMyOrders);

// GET /api/orders/admin/all (admin order management)
router.get('/admin/all', orderController.getAllOrders);

// GET /api/orders/:id (single order details)
router.get('/:id', optionalAuth, orderController.getOrderById);

// PATCH /api/orders/:id/status (update status for fulfillment/admin)
router.patch('/:id/status', orderController.updateOrderStatus);

export default router;
