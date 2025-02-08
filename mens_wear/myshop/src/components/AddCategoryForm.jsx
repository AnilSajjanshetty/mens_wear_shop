// src/components/AddCategoryForm.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';

const AddCategoryForm = ({ show, handleClose, handleAddCategory }) => {
    const [categoryName, setCategoryName] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (categoryName.trim() === '') {
            alert("Category name cannot be empty.");
            return;
        }

        try {
            // Make the POST request using Axios
            const response = await axios.post('http://localhost:8000/api/v1/add-category',


                { categoryName: categoryName },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Include access token
                    }
                });
            if (response.status === 201) {
                handleAddCategory(); // Callback to update the categories list
                alert('Category added successfully!');
                setCategoryName("")
            } else {
                alert('Failed to add category!');
                setCategoryName("")
            }

        } catch (error) {
            console.error('Error adding category:', error);
            alert('An error occurred while adding the category.');
            setCategoryName("")

        }
        handleClose(); // Close the modal
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add New Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="categoryName">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter category name"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Category
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCategoryForm;
