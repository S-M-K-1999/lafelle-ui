import api from './api';

export const categoryService = {
  // Get all categories
  getAll: () => api.get('/v1/categories'),
  
  // Get single category
  getById: (id) => api.get(`/v1/categories/${id}`),
  
  // Create category (admin only)
  create: (categoryData) => api.post('/v1/categories', categoryData),
  
  // Update category (admin only)
  update: (id, categoryData) => api.put(`/v1/categories/${id}`, categoryData),
  
  // Delete category (admin only)
  delete: (id) => api.delete(`/v1/categories/${id}`)
};