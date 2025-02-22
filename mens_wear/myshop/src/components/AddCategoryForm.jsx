import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axiosInstance from "../utils/axiosInstance";
import Swal from "sweetalert2";
import config from '../../config';

const AddCategoryForm = ({ show, handleClose, selectedCategory }) => {
    const [categoryName, setCategoryName] = useState("");
    const server = config.server;

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
                await axiosInstance.put(`/edit-category/${selectedCategory.CategoryId}`, { categoryName });
                Swal.fire("Success", "Category updated successfully!", "success");
            } else {
                // Add new category
                await axiosInstance.post(`/add-category`, { categoryName });
                Swal.fire("Success", "Category added successfully!", "success");
            }
            handleClose();
        } catch (error) {
            Swal.fire("Error", "Error saving category!", "error");
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
                        <Form.Control
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button type="submit" className="mt-3">
                        {selectedCategory ? "Update" : "Add"}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddCategoryForm;
