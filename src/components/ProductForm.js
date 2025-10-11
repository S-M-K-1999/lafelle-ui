import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductForm = () => {
    // 1. Add 'imageFile' to state to hold the selected file object
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        imageUrl: '',
        category: ''
    });
    const [imageFile, setImageFile] = useState(null); // State for the file object
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [imagePreview, setImagePreview] = useState(null);
    const [base64Image, setBase64Image] = useState(null);
    const [convertingImage, setConvertingImage] = useState(false);
    const [compressingImage, setCompressingImage] = useState(false);
    const [originalFileSize, setOriginalFileSize] = useState(null);
    const [compressedFileSize, setCompressedFileSize] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageUrl, setModalImageUrl] = useState(null);

    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {

        if (isEditing) {
            setLoading(true);
            axios.get(`${API_URL}/v1/products/${id}`)
                .then(response => {
                    // Pre-fill the form with existing product data
                    const productData = {
                        name: response.data.name,
                        description: response.data.description,
                        price: response.data.price,
                        imageUrl: response.data.imageUrl,
                        category: response.data.category
                    };
                    setProduct(productData);
                    if (productData.imageUrl) {
                        setImagePreview(productData.imageUrl);
                        // Check if the imageUrl is a base64 data URL
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

    // Handle keyboard events for modal
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape' && showImageModal) {
                closeImageModal();
            }
        };

        if (showImageModal) {
            document.addEventListener('keydown', handleKeyDown);
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [showImageModal]);

    // Update handleChange to handle both text and file inputs
    const handleChange = (e) => {
        const { name, value, type } = e.target;

        if (type === 'file') {
            // Handle file input separately
            const file = e.target.files[0];
            setImageFile(file);
            if (file) {
                // Check file size (5MB limit)
                const maxSize = 5 * 1024 * 1024; // 5MB
                if (file.size > maxSize) {
                    setErrors({ image: 'File size too large. Please select an image smaller than 5MB.' });
                    return;
                }
                
                setCompressingImage(true);
                setConvertingImage(true);
                
                // Store original file size
                setOriginalFileSize(file.size);
                
                // Compress and convert to base64
                compressImage(file)
                    .then((compressedBase64) => {
                        setImagePreview(compressedBase64);
                        setBase64Image(compressedBase64);
                        // Set the compressed base64 string as imageUrl for backend
                        setProduct(prev => ({ ...prev, imageUrl: compressedBase64 }));
                        
                        // Calculate compressed size (approximate)
                        const compressedSize = Math.round((compressedBase64.length * 3) / 4);
                        setCompressedFileSize(compressedSize);
                        
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
            // Handle all other text/number inputs
            setProduct(prevProduct => ({
                ...prevProduct,
                [name]: value
            }));
            // Update image preview when URL is entered
            if (name === 'imageUrl' && value) {
                setImageFile(null);
                setImagePreview(value);
                // Clear base64 if user enters a regular URL
                if (!value.startsWith('data:image/')) {
                    setBase64Image(null);
                } else {
                    setBase64Image(value);
                }
            }
            // Clear errors when user starts typing
            if (errors[name]) {
                setErrors(prev => ({ ...prev, [name]: '' }));
            }
        }
    };

    // Function to compress image
    const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                // Calculate new dimensions
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
                
                // Set canvas dimensions
                canvas.width = width;
                canvas.height = height;
                
                // Draw and compress
                ctx.drawImage(img, 0, 0, width, height);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedDataUrl);
            };
            
            img.src = URL.createObjectURL(file);
        });
    };

    // Function to open image modal
    const openImageModal = (imageUrl) => {
        setModalImageUrl(imageUrl);
        setShowImageModal(true);
    };

    // Function to close image modal
    const closeImageModal = () => {
        setShowImageModal(false);
        setModalImageUrl(null);
    };

    // Function to clear image selection
    const clearImageSelection = () => {
        setImageFile(null);
        setImagePreview(null);
        setBase64Image(null);
        setConvertingImage(false);
        setCompressingImage(false);
        setOriginalFileSize(null);
        setCompressedFileSize(null);
        setProduct(prev => ({ ...prev, imageUrl: '' }));
        // Reset file input
        const fileInput = document.querySelector('input[type="file"]');
        if (fileInput) {
            fileInput.value = '';
        }
    };

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
        if (!product.category.trim()) {
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
        
        // Prepare the product data object
        const productData = {
            name: product.name,
            description: product.description,
            price: parseFloat(product.price),
            category: product.category,
            imageUrl: product.imageUrl.trim() || null
        };

        // If editing and no new image provided, don't send imageUrl to keep existing
        if (isEditing && !imageFile && !product.imageUrl.trim() && imagePreview) {
            delete productData.imageUrl;
        }

        try {
            // Send JSON data instead of FormData since we're using base64
            if (isEditing) {
                await axios.post(`${API_URL}/v1/products/update/${id}`, productData, {
                    headers: { 'Content-Type': 'application/json' }
                });
            } else {
                await axios.post(`${API_URL}/v1/products/add`, productData, {
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            navigate('/admin');
        } catch (error) {
            // Log the error response from the server for debugging
            console.error('There was an error submitting the form!', error.response || error);
            setErrors({ general: 'Failed to save product. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    const styles = {
        container: {
            padding: '2rem',
            maxWidth: '800px',
            margin: '0 auto',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #dee2e6',
        },
        title: {
            fontSize: '3.2rem', // 3.2rem = 32px with 62.5% base
            fontWeight: '700',
            color: '#2c3e50',
            margin: 0,
        },
        backButton: {
            backgroundColor: '#6c757d',
            border: 'none',
            color: 'white',
            padding: '0.8rem 1.6rem',
            borderRadius: '8px',
            fontSize: '1.4rem',
            fontWeight: '500',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
        },
        card: {
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            border: '2px solid #dee2e6',
        },
        cardHeader: {
            backgroundColor: '#f8f9fa',
            padding: '2rem',
            borderBottom: '2px solid #dee2e6',
        },
        cardBody: {
            padding: '2rem',
        },
        formGroup: {
            marginBottom: '2rem',
        },
        label: {
            display: 'block',
            fontSize: '1.6rem', // 1.6rem = 16px with 62.5% base
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '0.8rem',
        },
        input: {
            width: '100%',
            padding: '1.2rem',
            fontSize: '1.6rem', // 1.6rem = 16px with 62.5% base
            border: '2px solid #dee2e6',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            backgroundColor: '#fff',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
        inputPlaceholder: {
            color: '#adb5bd', // Light gray for placeholder text
        },
        inputFocus: {
            borderColor: '#81c784',
            boxShadow: '0 0 0 0.2rem rgba(129, 199, 132, 0.25)',
        },
        textarea: {
            width: '100%',
            padding: '1.2rem',
            fontSize: '1.6rem',
            border: '2px solid #dee2e6',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            backgroundColor: '#fff',
            minHeight: '120px',
            resize: 'vertical',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
        textareaPlaceholder: {
            color: '#adb5bd', // Light gray for placeholder text
        },
        fileInput: {
            width: '100%',
            padding: '1.2rem',
            fontSize: '1.6rem',
            border: '2px dashed #81c784',
            borderRadius: '8px',
            backgroundColor: '#f8fff8',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 1px 3px rgba(129, 199, 132, 0.2)',
        },
        imagePreview: {
            width: '100%',
            maxHeight: '300px',
            objectFit: 'cover',
            borderRadius: '8px',
            marginTop: '1rem',
            border: '2px solid #e9ecef',
        },
        imagePreviewContainer: {
            textAlign: 'center',
            marginTop: '1rem',
        },
        errorMessage: {
            color: '#dc3545',
            fontSize: '1.4rem',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        successMessage: {
            color: '#28a745',
            fontSize: '1.4rem',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        buttonContainer: {
            display: 'flex',
            gap: '1rem',
            justifyContent: 'flex-end',
            marginTop: '2rem',
        },
        submitButton: {
            backgroundColor: '#81c784',
            border: 'none',
            color: 'white',
            padding: '1.2rem 2.4rem',
            borderRadius: '8px',
            fontSize: '1.6rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        cancelButton: {
            backgroundColor: '#6c757d',
            border: 'none',
            color: 'white',
            padding: '1.2rem 2.4rem',
            borderRadius: '8px',
            fontSize: '1.6rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '400px',
            fontSize: '1.6rem',
            color: '#6c757d',
        },
        fileInfo: {
            fontSize: '1.4rem',
            color: '#28a745',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
        },
        compressionInfo: {
            fontSize: '1.4rem',
            color: '#ffc107',
            marginTop: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: '500',
        },
        imageSection: {
            border: '2px solid #dee2e6',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        },
        imageSectionTitle: {
            fontSize: '1.8rem',
            fontWeight: '600',
            color: '#2c3e50',
            marginBottom: '1rem',
        },
        toggleButtons: {
            display: 'flex',
            gap: '1rem',
            marginBottom: '1rem',
        },
        toggleButton: {
            padding: '0.8rem 1.6rem',
            border: '2px solid #81c784',
            backgroundColor: 'transparent',
            color: '#81c784',
            borderRadius: '6px',
            fontSize: '1.4rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        toggleButtonActive: {
            backgroundColor: '#81c784',
            color: 'white',
        },
        // Image Modal Styles
        modalOverlay: {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
            opacity: showImageModal ? 1 : 0,
            visibility: showImageModal ? 'visible' : 'hidden',
            transition: 'all 0.3s ease',
        },
        modalContent: {
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            transform: showImageModal ? 'scale(1)' : 'scale(0.8)',
            transition: 'transform 0.3s ease',
        },
        modalImage: {
            width: '100%',
            height: '100%',
            maxWidth: '90vw',
            maxHeight: '90vh',
            objectFit: 'contain',
            display: 'block',
        },
        modalCloseButton: {
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '4rem',
            height: '4rem',
            fontSize: '2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            zIndex: 1001,
        },
        modalImageContainer: {
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
        },
        modalImageHover: {
            transform: 'scale(1.02)',
        },
    };

    if (loading && isEditing) {
        return (
            <div style={styles.container}>
                <div style={styles.loadingContainer}>
                    <div>🔄 Loading product data...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            {/* CSS for placeholder styling */}
            <style>
                {`
                    .product-form input::placeholder,
                    .product-form textarea::placeholder {
                        color: #adb5bd !important;
                        opacity: 1;
                    }
                `}
            </style>
            
            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>
                    {isEditing ? '✏️ Edit Product' : '➕ Create New Product'}
                </h1>
                <button
                    onClick={() => navigate('/admin')}
                    style={styles.backButton}
                >
                    ← Back to Products
                </button>
            </div>

            {/* Form Card */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <h2 style={{ fontSize: '2.4rem', margin: 0, color: '#2c3e50' }}>
                        Product Information
                    </h2>
                </div>
                
                <div style={styles.cardBody} className="product-form">
                    {errors.general && (
                        <div style={styles.errorMessage}>
                            ❌ {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Product Name */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                📝 Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={product.name}
                                onChange={handleChange}
                                style={{
                                    ...styles.input,
                                    ...(errors.name ? { borderColor: '#dc3545' } : {})
                                }}
                                placeholder="Enter product name"
                            />
                            {errors.name && (
                                <div style={styles.errorMessage}>
                                    ⚠️ {errors.name}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div style={styles.formGroup}>
                            <label style={styles.label}>
                                📄 Description *
                            </label>
                            <textarea
                                name="description"
                                value={product.description}
                                onChange={handleChange}
                                style={{
                                    ...styles.textarea,
                                    ...(errors.description ? { borderColor: '#dc3545' } : {})
                                }}
                                placeholder="Enter product description"
                            />
                            {errors.description && (
                                <div style={styles.errorMessage}>
                                    ⚠️ {errors.description}
                                </div>
                            )}
                        </div>

                        {/* Price and Category Row */}
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ ...styles.formGroup, flex: 1 }}>
                                <label style={styles.label}>
                                    💰 Price *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    style={{
                                        ...styles.input,
                                        ...(errors.price ? { borderColor: '#dc3545' } : {})
                                    }}
                                    placeholder="0.00"
                                />
                                {errors.price && (
                                    <div style={styles.errorMessage}>
                                        ⚠️ {errors.price}
                                    </div>
                                )}
                            </div>

                            <div style={{ ...styles.formGroup, flex: 1 }}>
                                <label style={styles.label}>
                                    🏷️ Category *
                                </label>
                                <input
                                    type="text"
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    style={{
                                        ...styles.input,
                                        ...(errors.category ? { borderColor: '#dc3545' } : {})
                                    }}
                                    placeholder="e.g., Flowers, Plants"
                                />
                                {errors.category && (
                                    <div style={styles.errorMessage}>
                                        ⚠️ {errors.category}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Image Section */}
                        <div style={styles.imageSection}>
                            <h3 style={styles.imageSectionTitle}>
                                🖼️ Product Image *
                            </h3>
                            
                            {/* Image Preview */}
                            {imagePreview && (
                                <div style={styles.imagePreviewContainer}>
                                    <img
                                        src={imagePreview}
                                        alt="Product preview"
                                        style={styles.imagePreview}
                                        onClick={() => openImageModal(imagePreview)}
                                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: '0.5rem',
                                        right: '0.5rem',
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                        color: 'white',
                                        padding: '0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '1.2rem',
                                        pointerEvents: 'none',
                                    }}>
                                        👆 Click to view full size
                                    </div>
                                </div>
                            )}

                            {/* Current Image Display */}
                            {isEditing && imagePreview && !imageFile && !product.imageUrl.trim() && (
                                <div style={styles.formGroup}>
                                    <label style={styles.label}>
                                        🖼️ Current Image
                                    </label>
                                    <div style={styles.imagePreviewContainer}>
                                        <img
                                            src={imagePreview}
                                            alt="Current product"
                                            style={styles.imagePreview}
                                            onClick={() => openImageModal(imagePreview)}
                                            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                                            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                                        />
                                        <div style={{
                                            position: 'absolute',
                                            top: '0.5rem',
                                            right: '0.5rem',
                                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            color: 'white',
                                            padding: '0.5rem',
                                            borderRadius: '4px',
                                            fontSize: '1.2rem',
                                            pointerEvents: 'none',
                                        }}>
                                            👆 Click to view full size
                                        </div>
                                    </div>
                                    <div style={styles.fileInfo}>
                                        ℹ️ This is the current product image. Upload a new file or enter a new URL to change it.
                                    </div>
                                </div>
                            )}

                            {/* Image URL Input */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    🌐 Image URL {imageFile ? '(Disabled - File Selected)' : ''}
                                </label>
                                <input
                                    type="url"
                                    name="imageUrl"
                                    value={product.imageUrl}
                                    onChange={handleChange}
                                    style={{
                                        ...styles.input,
                                        ...(imageFile ? { opacity: 0.5, cursor: 'not-allowed' } : {}),
                                        ...(errors.image ? { borderColor: '#dc3545' } : {})
                                    }}
                                    placeholder="https://example.com/image.jpg"
                                    disabled={!!imageFile}
                                />
                                {imageFile && (
                                    <div style={styles.fileInfo}>
                                        ✅ File selected: {imageFile.name}
                                    </div>
                                )}
                            </div>

                            {/* File Upload */}
                            <div style={styles.formGroup}>
                                <label style={styles.label}>
                                    📁 Upload Image File {product.imageUrl.trim() ? '(Disabled - URL Entered)' : ''}
                                </label>
                                <input
                                    type="file"
                                    name="imageFile"
                                    onChange={handleChange}
                                    accept="image/*"
                                    style={{
                                        ...styles.fileInput,
                                        ...(product.imageUrl.trim() ? { opacity: 0.5, cursor: 'not-allowed' } : {})
                                    }}
                                    disabled={!!product.imageUrl.trim()}
                                />
                                {compressingImage && (
                                    <div style={styles.compressionInfo}>
                                        🗜️ Compressing image...
                                    </div>
                                )}
                                {convertingImage && !compressingImage && (
                                    <div style={styles.fileInfo}>
                                        🔄 Converting image to base64...
                                    </div>
                                )}
                                {imageFile && base64Image && !convertingImage && !compressingImage && (
                                    <div>
                                        <div style={styles.fileInfo}>
                                            ✅ Image compressed and converted to base64 - ready to send
                                        </div>
                                        
                                    </div>
                                )}
                            </div>

                            {/* Clear Image Button */}
                            {(imageFile || product.imageUrl.trim() || (isEditing && imagePreview)) && (
                                <div style={styles.formGroup}>
                                    <button
                                        type="button"
                                        onClick={clearImageSelection}
                                        style={{
                                            ...styles.cancelButton,
                                            fontSize: '1.4rem',
                                            padding: '0.8rem 1.6rem',
                                            backgroundColor: '#ffc107',
                                            color: '#212529',
                                        }}
                                    >
                                        🗑️ Clear Image Selection
                                    </button>
                                </div>
                            )}

                            {errors.image && (
                                <div style={styles.errorMessage}>
                                    ⚠️ {errors.image}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div style={styles.buttonContainer}>
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                style={styles.cancelButton}
                            >
                                ❌ Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    ...styles.submitButton,
                                    ...(loading ? { opacity: 0.7, cursor: 'not-allowed' } : {})
                                }}
                            >
                                {loading ? '⏳' : (isEditing ? '💾 Update Product' : '➕ Create Product')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Image Modal */}
            {showImageModal && (
                <div 
                    style={styles.modalOverlay}
                    onClick={closeImageModal}
                >
                    <div 
                        style={styles.modalContent}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            style={styles.modalCloseButton}
                            onClick={closeImageModal}
                            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.9)'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.7)'}
                        >
                            ×
                        </button>
                        <img
                            src={modalImageUrl}
                            alt="Full size preview"
                            style={styles.modalImage}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductForm;