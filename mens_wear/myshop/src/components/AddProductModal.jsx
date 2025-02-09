// src/components/AddProductModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
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
            // Populate form with existing product data when editing
            setValue("ProductName", product.ProductName);
            setValue("Description", product.Description);
            setValue("Price", product.Price);
            setValue("Stock", product.Stock);
            setValue("CategoryId", product.CategoryId);
        } else {
            reset(); // Reset form if adding a new product
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
                // Update existing product
                await axios.put(`http://192.168.223.231:8000/api/v1/edit-product/${product.ProductId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                alert("Product updated successfully");
            } else {
                // Add new product
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
                        <Form.Control type="file" name="Image" multiple onChange={(e) => setSelectedImages([...e.target.files])} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        {product ? "Update Product" : "Add Product"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddProductModal;
