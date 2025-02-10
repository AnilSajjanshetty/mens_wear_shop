// src/components/AddProductModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AddProductModal = ({ show, handleClose, refreshProducts, product }) => {
    const { register, handleSubmit, reset, setValue } = useForm();
    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        if (product) {
            setValue("ProductName", product.ProductName);
            setValue("Description", product.Description);
            setValue("Price", product.Price);
            setValue("Stock", product.Stock);
            setValue("CategoryId", product.CategoryId);
        } else {
            reset();
        }
    }, [product, setValue, reset]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/v1/get-category');
            setCategories(response.data || []);
        } catch (error) {
            console.error("Failed to fetch categories", error);
        }
    };

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append("ProductName", data.ProductName);
        formData.append("Description", data.Description);
        formData.append("Price", data.Price);
        formData.append("Stock", data.Stock);
        formData.append("CategoryId", data.CategoryId);
        selectedImages.forEach(image => formData.append("Image", image));

        try {
            if (product) {
                await axios.put(`http://192.168.223.231:8000/api/v1/edit-product/${product.ProductId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Product updated successfully");
            } else {
                await axios.post('http://192.168.223.231:8000/api/v1/add-product', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Product added successfully");
            }
            reset();
            refreshProducts();
            handleClose();
        } catch (error) {
            console.error("Error saving product", error);
            alert("Failed to save product");
        }
    };

    const handleRemoveImage = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
    };

    const handleImageSelection = (e) => {
        const files = Array.from(e.target.files); // Convert FileList to array
        setSelectedImages(prevImages => [...prevImages, ...files]);
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{product ? "Edit Product" : "Add New Product"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control type="text" {...register("ProductName")} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" {...register("Description")} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" {...register("Price")} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control type="text" {...register("Stock")} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select {...register("CategoryId")} required>
                            <option value="">{product ? product?.categoryName : "Select a Category"}</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.categoryName}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Upload Images</Form.Label>
                        <Form.Control
                            type="file"
                            name="Image"
                            multiple
                            onChange={handleImageSelection}
                        />
                    </Form.Group>

                    {/* Display selected images */}
                    <Row>
                        {selectedImages.length > 0 && selectedImages.map((image, index) => (
                            <Col key={index} xs={6} md={4} lg={3} className="mb-2">
                                <div style={{ position: 'relative' }} className='g-0 d-flex align-items-start'>
                                    <Image
                                        src={URL.createObjectURL(image)}
                                        alt={`Selected Image ${index + 1}`}
                                        style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    />
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        style={{

                                            top: '-5px',
                                            right: '-5px',
                                            padding: '0',
                                            width: '20px',
                                            height: '20px',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontSize: '14px', // Adjust font size for the cross
                                            lineHeight: '1',  // Adjust line height to help with vertical centering
                                        }}
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        &times;
                                    </Button>

                                </div>
                            </Col>
                        ))}
                    </Row>

                    <Button variant="primary" type="submit">
                        {product ? "Update Product" : "Add Product"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddProductModal;
