import express from 'express';
import { productController } from '../controllers/productController.js';

const router = express.Router();

// GET /api/products/categories (placed before :id to prevent collision)
router.get('/categories', productController.getCategories);

// GET /api/products
router.get('/', productController.getProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

export default router;
