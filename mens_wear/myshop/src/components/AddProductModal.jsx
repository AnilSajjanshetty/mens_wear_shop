import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Image } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import axiosInstance from "../utils/axiosInstance";
import Swal from "sweetalert2";

const AddProductModal = ({ show, handleClose, refreshProducts, product }) => {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();
    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        if (product?.Image) {
            setSelectedImages(product.Image);
        }
    }, [product]);

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
            setSelectedImages([]);
        }
    }, [product, setValue, reset]);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get(`/get-category`);
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
                await axiosInstance.put(`/edit-product/${product.ProductId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire("Success", "Product updated successfully!", "success");
            } else {
                await axiosInstance.post(`/add-product`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Swal.fire("Success", "Product added successfully!", "success");
            }

            reset();
            setSelectedImages([]);
            refreshProducts();
            handleClose();
        } catch (error) {
            console.error("Error saving product", error);
            Swal.fire("Error", "Failed to save product!", "error");
        }
    };

    const handleRemoveImage = (index) => {
        const updatedImages = selectedImages.filter((_, i) => i !== index);
        setSelectedImages(updatedImages);
    };

    const handleImageSelection = (e) => {
        const files = Array.from(e.target.files);
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
                        <Form.Control type="text" {...register("ProductName", {
                            required: "Product name is required",
                            minLength: { value: 3, message: "Must be at least 3 characters long" },
                            maxLength: { value: 100, message: "Cannot exceed 100 characters" }
                        })} />
                        {errors.ProductName && <p className="text-danger">{errors.ProductName.message}</p>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" {...register("Description", {
                            required: "Description is required",
                            minLength: { value: 10, message: "Must be at least 10 characters long" },
                            maxLength: { value: 1000, message: "Cannot exceed 1000 characters" }
                        })} />
                        {errors.Description && <p className="text-danger">{errors.Description.message}</p>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Price</Form.Label>
                        <Form.Control type="number" {...register("Price", {
                            required: "Price is required",
                            min: { value: 0.01, message: "Must be at least 0.01" }
                        })} />
                        {errors.Price && <p className="text-danger">{errors.Price.message}</p>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Stock</Form.Label>
                        <Form.Control type="number" {...register("Stock", {
                            required: "Stock is required",
                            min: { value: 0, message: "Cannot be negative" }
                        })} />
                        {errors.Stock && <p className="text-danger">{errors.Stock.message}</p>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select {...register("CategoryId")} required>
                            <option value="">{product ? product?.categoryName : "Select a Category"}</option>
                            {categories.map(category => (
                                <option key={category._id} value={category._id}>{category.categoryName}</option>
                            ))}
                        </Form.Select>
                        {errors.CategoryId && <p className="text-danger">{errors.CategoryId.message}</p>}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Upload Images</Form.Label>
                        <Form.Control type="file" multiple onChange={handleImageSelection} />
                    </Form.Group>

                    {/* Display selected images */}
                    <Row>
                        {selectedImages.length > 0 && selectedImages.map((image, index) => (
                            <Col key={index} xs={6} md={4} lg={3} className="mb-2">
                                <div style={{ position: 'relative' }} className='g-0 d-flex align-items-start'>
                                    <Image
                                        src={typeof image === 'string'
                                            ? `http://localhost:8000/${image}`
                                            : URL.createObjectURL(image)
                                        }
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
                                            fontSize: '14px',
                                            lineHeight: '1',
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
