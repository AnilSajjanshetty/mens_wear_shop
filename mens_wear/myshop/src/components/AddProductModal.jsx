// src/components/AddProductModal.js
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axios from 'axios';

const AddProductModal = ({ show, handleClose, refreshProducts }) => {
    const { register, handleSubmit, reset } = useForm();
    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://192.168.223.231:8000/api/v1/get-category');
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

            console.log({ formData })
            await axios.post('http://192.168.223.231:8000/api/v1/add-product', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert("Product added successfully");
            reset();
            refreshProducts();
            handleClose();
        } catch (error) {
            console.error("Error adding product", error);
            alert("Failed to add product");
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Product</Modal.Title>
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
                            <option value="">Select a category</option>
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
                        Add Product
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddProductModal;
