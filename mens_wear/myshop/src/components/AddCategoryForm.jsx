import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import config from '../../config';

const AddCategoryForm = ({ show, handleClose, handleAddCategory, selectedCategory }) => {
    const [categoryName, setCategoryName] = useState("");
    const server = config.server
    useEffect(() => {
        if (selectedCategory) {
            setCategoryName(selectedCategory.categoryName);
        } else {
            setCategoryName("");
        }
    }, [selectedCategory]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedCategory) {
                // Update existing category
                await axios.put(`${server}/edit-category/${selectedCategory.CategoryId}`, { categoryName });
                alert("Category updated successfully!");
            } else {
                // Add new category
                await axios.post(`${server}/add-category`, { categoryName });
                alert("Category added successfully!");
            }
            handleAddCategory();
        } catch (error) {
            alert("Error saving category!");
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{selectedCategory ? "Edit Category" : "Add Category"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} required />
                    </Form.Group>
                    <Button type="submit" className="mt-3">{selectedCategory ? "Update" : "Add"}</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCategoryForm;
