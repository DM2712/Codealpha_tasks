import { productService } from '../services/productService.js';

export const productController = {
  // GET /api/products
  async getProducts(req, res) {
    try {
      const { limit, skip, category, search, q, sortBy, order } = req.query;
      const data = await productService.getProducts({
        limit: limit ? parseInt(limit, 10) : 20,
        skip: skip ? parseInt(skip, 10) : 0,
        category,
        search: search || q,
        sortBy,
        order
      });

      return res.status(200).json({
        success: true,
        ...data
      });
    } catch (error) {
      console.error('Error in getProducts:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch products',
        error: error.message
      });
    }
  },

  // GET /api/products/categories
  async getCategories(req, res) {
    try {
      const categories = await productService.getCategories();
      return res.status(200).json({
        success: true,
        categories
      });
    } catch (error) {
      console.error('Error in getCategories:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch categories',
        error: error.message
      });
    }
  },

  // GET /api/products/:id
  async getProductById(req, res) {
    try {
      const { id } = req.params;
      const product = await productService.getProductById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        });
      }

      return res.status(200).json({
        success: true,
        product
      });
    } catch (error) {
      console.error(`Error in getProductById for ID ${req.params.id}:`, error);
      return res.status(404).json({
        success: false,
        message: 'Product not found or failed to load',
        error: error.message
      });
    }
  }
};
