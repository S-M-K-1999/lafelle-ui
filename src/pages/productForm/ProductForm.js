import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { categoryService } from '../../services/category';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductForm.css';

const ProductForm = () => {
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [base64Image, setBase64Image] = useState(null);
    const [convertingImage, setConvertingImage] = useState(false);
    const [compressingImage, setCompressingImage] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState(null);
    
    // New states for category management
    const [categories, setCategories] = useState([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: ''
    });
    const [savingCategory, setSavingCategory] = useState(false);

    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const API_URL = process.env.REACT_APP_API_URL;

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch product data when editing
    useEffect(() => {
        if (isEditing) {
            setLoading(true);
            api.get(`${API_URL}/v1/products/${id}`)
                .then(response => {
                    const productData = {
                        name: response.data.name,
                        description: response.data.description,
                        price: response.data.price,
                        imageUrl: response.data.imageUrl,
                        category: response.data.category?._id || response.data.category || ''
                    };
                    setProduct(productData);
                    if (productData.imageUrl) {
                        setImagePreview(productData.imageUrl);
                        if (productData.imageUrl.startsWith('data:image/')) {
                            setBase64Image(productData.imageUrl);
                        }
                    }
                })
                .catch(error => {
                    console.error('There was an error fetching the product!', error);
                    setErrors({ general: 'Failed to load product data' });
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [id, isEditing, API_URL]);

    // Fetch categories function
    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const response = await categoryService.getAll();
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setErrors(prev => ({ ...prev, categories: 'Failed to load categories' }));
        } finally {
            setCategoriesLoading(false);
        }
    };

    // Handle category selection
    const handleCategoryChange = (e) => {
        const value = e.target.value;
        
        if (value === 'add-new') {
            // Open modal to add new category
            setShowCategoryModal(true);
        } else {
            // Set selected category
            setProduct(prev => ({ ...prev, category: value }));
        }
    };

    // Handle new category input changes
    const handleNewCategoryChange = (e) => {
        const { name, value } = e.target;
        setNewCategory(prev => ({ ...prev, [name]: value }));
    };

    // Save new category
    const handleSaveCategory = async () => {
        if (!newCategory.name.trim()) {
            alert('Please enter a category name');
            return;
        }

        setSavingCategory(true);
        try {
            const response = await categoryService.create(newCategory);
            const savedCategory = response.data;
            
            // Add new category to the list
            setCategories(prev => [...prev, savedCategory]);
            
            // Set the new category as selected
            setProduct(prev => ({ ...prev, category: savedCategory._id }));
            
            // Close modal and reset form
            setShowCategoryModal(false);
            setNewCategory({ name: '', description: '' });
        } catch (error) {
            console.error('Error creating category:', error);
            alert('Failed to create category. Please try again.');
        } finally {
            setSavingCategory(false);
        }
    };

    // Close category modal
    const handleCloseCategoryModal = () => {
        setShowCategoryModal(false);
        setNewCategory({ name: '', description: '' });
    };

    // Rest of your existing functions remain the same...
    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
                const maxSize = 5 * 1024 * 1024;
                if (file.size > maxSize) {
                    setErrors({ image: 'File size too large. Please select an image smaller than 5MB.' });
                    return;
                }
                
                setCompressingImage(true);
                setConvertingImage(true);
                
                compressImage(file)
                    .then((compressedBase64) => {
                        setImagePreview(compressedBase64);
                        setBase64Image(compressedBase64);
                        setProduct(prev => ({ ...prev, imageUrl: compressedBase64 }));
                        setCompressingImage(false);
                        setConvertingImage(false);
                    })
                    .catch((error) => {
                        console.error('Error compressing image:', error);
                        setErrors({ image: 'Error processing image. Please try again.' });
                        setCompressingImage(false);
                        setConvertingImage(false);
                    });
            }
        } else {
            setProduct(prevProduct => ({
                ...prevProduct,
                [name]: value
            }));
            if (name === 'imageUrl' && value) {
                setImageFile(null);
                setImagePreview(value);
                if (!value.startsWith('data:image/')) {
                    setBase64Image(null);
                } else {
                    setBase64Image(value);
                }
            }
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                let { width, height } = img;
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    const openImageModal = (imageUrl) => {
        setModalImageUrl(imageUrl);
        setShowImageModal(true);
    };

    const closeImageModal = () => {
        setShowImageModal(false);
        setModalImageUrl(null);
    };

    const clearImageSelection = () => {
        setImageFile(null);
        setImagePreview(null);
        setBase64Image(null);
        setConvertingImage(false);
        setCompressingImage(false);
        setProduct(prev => ({ ...prev, imageUrl: '' }));
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const categoryValue = typeof product.category === 'string'
        ? product.category.trim()
        : Array.isArray(product.category)
        ? product.category.join(', ').trim()
        : (product.category?.name || '').trim();

    const validateForm = () => {
        const newErrors = {};
        
        if (!product.name.trim()) {
            newErrors.name = 'Product name is required';
        }
        if (!product.description.trim()) {
            newErrors.description = 'Description is required';
        }
        if (!product.price || product.price <= 0) {
            newErrors.price = 'Valid price is required';
        }
        if (!categoryValue) {
            newErrors.category = 'Category is required';
          }
        if (!imageFile && !product.imageUrl.trim() && !imagePreview) {
            newErrors.image = 'Image URL or file is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setErrors({});
        
        const productData = {
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            category: product.category,
            imageUrl: product.imageUrl.trim() || null
        };

        if (isEditing && !imageFile && !product.imageUrl.trim() && imagePreview) {
            delete productData.imageUrl;
        }

        try {
            if (isEditing) {
                await api.put(`${API_URL}/v1/products/update/${id}`, productData, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                await api.post(`${API_URL}/v1/products/add`, productData, {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            navigate('/admin');
        } catch (error) {
            console.error('There was an error submitting the form!', error.response || error);
            setErrors({ general: 'Failed to save product. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="product-form-container">
                <div className="product-form-loading-container">
                    <div>🔄 Loading product data...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="product-form-container">
            {/* Header */}
            <div className="product-form-header">
                <h1 className="product-form-title">
                    {isEditing ? '✏️ Edit Product' : '➕ Create New Product'}
                </h1>
                <button
                    onClick={() => navigate('/admin')}
                    className="product-form-back-button"
                >
                    ← Back to Products
                </button>
            </div>

            {/* Form Card */}
            <div className="product-form-card">
                <div className="product-form-card-header">
                    <h2 style={{ fontSize: '2.4rem', margin: 0, color: '#2c3e50' }}>
                        Product Information
                    </h2>
                </div>
                
                <div className="product-form-card-body product-form">
                    {errors.general && (
                        <div className="product-form-error-message">
                            ❌ {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Product Name */}
                        <div className="product-form-group">
                            <label className="product-form-label">
                                📝 Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                className={`product-form-input ${errors.name ? 'product-form-input-error' : ''}`}
                                placeholder="Enter product name"
                            />
                            {errors.name && (
                                <div className="product-form-error-message">
                                    ⚠️ {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="product-form-group">
                            <label className="product-form-label">
                                📄 Description *
                            </label>
                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                className={`product-form-textarea ${errors.description ? 'product-form-input-error' : ''}`}
                                placeholder="Enter product description"
                            />
                            {errors.description && (
                                <div className="product-form-error-message">
                                    ⚠️ {errors.description}
                                </div>
                            )}
                        </div>

                        {/* Price and Category Row */}
                        <div className="product-form-row">
                            <div className="product-form-group">
                                <label className="product-form-label">
                                    💰 Price *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    className={`product-form-input ${errors.price ? 'product-form-input-error' : ''}`}
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <div className="product-form-error-message">
                                        ⚠️ {errors.price}
                                    </div>
                                )}
                            </div>

                            <div className="product-form-group">
                                <label className="product-form-label">
                                    🏷️ Category *
                                </label>
                                {categoriesLoading ? (
                                    <div className="product-form-category-loading">
                                        Loading categories...
                                    </div>
                                ) : (
                                    <div className="product-form-category-dropdown">
                                        <select
                                            value={product.category}
                                            onChange={handleCategoryChange}
                                            className={`product-form-category-select ${errors.category ? 'error' : ''}`}
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map(category => (
                                                <option key={category._id} value={category._id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                            <option value="add-new" className="product-form-add-category-option">
                                                ➕ Add New Category
                                            </option>
                                        </select>
                                        {errors.category && (
                                            <div className="product-form-error-message">
                                                ⚠️ {errors.category}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Section - Rest of your existing image section remains the same */}
                        <div className="product-form-image-section">
                            <h3 className="product-form-image-section-title">
                                🖼️ Product Image *
                            </h3>
                            
                            {/* ... rest of your image section code ... */}
                            {/* Image Preview */}
                            {imagePreview && (
                                <div className="product-form-image-preview-container">
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        className="product-form-image-preview"
                                        onClick={() => openImageModal(imagePreview)}
                                    />
                                    <div className="product-form-image-preview-hint">
                                        👆 Click to view full size
                                    </div>
                                </div>
                            )}

                            {/* Current Image Display */}
                            {isEditing && imagePreview && !imageFile && !product.imageUrl.trim() && (
                                <div className="product-form-group">
                                    <label className="product-form-label">
                                        🖼️ Current Image
                                    </label>
                                    <div className="product-form-image-preview-container">
                                        <img
                                            src={imagePreview}
                                            alt="Current product"
                                            className="product-form-image-preview"
                                            onClick={() => openImageModal(imagePreview)}
                                        />
                                        <div className="product-form-image-preview-hint">
                                            👆 Click to view full size
                                        </div>
                                    </div>
                                    <div className="product-form-file-info">
                                        ℹ️ This is the current product image. Upload a new file or enter a new URL to change it.
                                    </div>
                                </div>
                            )}

                            {/* Image URL Input */}
                            <div className="product-form-group">
                                <label className="product-form-label">
                                    🌐 Image URL {imageFile ? '(Disabled - File Selected)' : ''}
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={product.imageUrl}
                                    onChange={handleChange}
                                    className={`product-form-input ${errors.image ? 'product-form-input-error' : ''}`}
                                    placeholder="https://example.com/image.jpg"
                                    disabled={!!imageFile}
                                />
                                {imageFile && (
                                    <div className="product-form-file-info">
                                        ✅ File selected: {imageFile.name}
                                    </div>
                                )}
                            </div>

                            {/* File Upload */}
                            <div className="product-form-group">
                                <label className="product-form-label">
                                    📁 Upload Image File {product.imageUrl.trim() ? '(Disabled - URL Entered)' : ''}
                                </label>
                                <input
                                    type="file"
                                    name="imageFile"
                                    onChange={handleChange}
                                    accept="image/*"
                                    className="product-form-file-input"
                                    disabled={!!product.imageUrl.trim()}
                                />
                                {compressingImage && (
                                    <div className="product-form-compression-info">
                                        🗜️ Compressing image...
                                    </div>
                                )}
                                {convertingImage && !compressingImage && (
                                    <div className="product-form-file-info">
                                        🔄 Converting image to base64...
                                    </div>
                                )}
                                {imageFile && base64Image && !convertingImage && !compressingImage && (
                                    <div>
                                        <div className="product-form-file-info">
                                            ✅ Image compressed and converted to base64 - ready to send
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Clear Image Button */}
                            {(imageFile || product.imageUrl.trim() || (isEditing && imagePreview)) && (
                                <div className="product-form-group">
                                    <button
                                        type="button"
                                        onClick={clearImageSelection}
                                        className="product-form-clear-image-button"
                                    >
                                        🗑️ Clear Image Selection
                                    </button>
                                </div>
                            )}

                            {errors.image && (
                                <div className="product-form-error-message">
                                    ⚠️ {errors.image}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="product-form-button-container">
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="product-form-cancel-button"
                            >
                                ❌ Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="product-form-submit-button"
                            >
                                {loading ? '⏳' : (isEditing ? '💾 Update Product' : '➕ Create Product')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Image Modal */}
            <div className={`product-form-modal-overlay ${showImageModal ? 'open' : ''}`}
                onClick={closeImageModal}>
                <div 
                    className="product-form-modal-content"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        className="product-form-modal-close-button"
                        onClick={closeImageModal}
                    >
                        ×
                    </button>
                    <img
                        src={modalImageUrl}
                        alt="Full size preview"
                        className="product-form-modal-image"
                    />
                </div>
            </div>

            {/* Category Modal */}
            <div className={`product-form-category-modal-overlay ${showCategoryModal ? 'open' : ''}`}
                onClick={handleCloseCategoryModal}>
                <div 
                    className="product-form-category-modal"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="product-form-category-modal-header">
                        <h3 className="product-form-category-modal-title">
                            ➕ Add New Category
                        </h3>
                        <button
                            className="product-form-category-modal-close"
                            onClick={handleCloseCategoryModal}
                        >
                            ×
                        </button>
                    </div>
                    
                    <div className="product-form-category-modal-body">
                        <div className="product-form-group">
                            <label className="product-form-label">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={newCategory.name}
                                onChange={handleNewCategoryChange}
                                className="product-form-input"
                                placeholder="Enter category name"
                            />
                        </div>
                        
                        <div className="product-form-group">
                            <label className="product-form-label">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={newCategory.description}
                                onChange={handleNewCategoryChange}
                                className="product-form-textarea"
                                placeholder="Enter category description (optional)"
                                rows="3"
                            />
                        </div>
                    </div>
                    
                    <div className="product-form-category-modal-actions">
                        <button
                            type="button"
                            onClick={handleCloseCategoryModal}
                            className="product-form-category-modal-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveCategory}
                            disabled={savingCategory}
                            className="product-form-category-modal-save"
                        >
                            {savingCategory ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;