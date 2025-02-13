import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Pagination } from 'react-bootstrap';
import NavbarComponent from '../components/NavbarComponent';
import { motion } from "framer-motion";
import AddCategoryForm from '../components/AddCategoryForm';
import axios from 'axios';
import SpinnerComponent from '../components/SpinnerComponent';
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"; // Import icons
import config from "../../config"
import { useNavigate } from 'react-router-dom';
const AllCategory = () => {
    const server = config.server
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null); // Store category to edit
    const itemsPerPage = 10;

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCategory(null); // Reset selected category when closing modal
    };
    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${server}/get-category`);
                setCategories(response.data || []);
            } catch (err) {
                setError('Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchCategories, 2000);
        return () => clearTimeout(timeout);
    }, [showModal]);

    const handleAddCategory = () => {
        handleCloseModal();
    };

    const handleEditCategory = (category) => {
        setSelectedCategory(category); // Set selected category for editing
        handleShowModal();
    };

    const handleDeleteCategory = async (categoryId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this category?");
        if (confirmDelete) {
            try {
                await axios.delete(`${server}/delete-category/${categoryId}`);
                setCategories(categories.filter(category => category._id !== categoryId));
                alert("Category deleted successfully!");
            } catch (error) {
                alert("Error deleting category!");
            }
        }
    };

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(categories.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    //======================================================================
    const navigate = useNavigate()
    const handleViewProducts = (category) => {
        const categoryId = category._id
        navigate(`/admin/category/${categoryId}`);

    }
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem", }}
        >
            <NavbarComponent />
            <Container>
                <h2>Manage Categories</h2>
                <Button className="btn btn-primary" onClick={handleShowModal}>Add Category</Button>

                {/* Show loading spinner or error message */}
                <div className="mt-4 text-center">
                    {loading ? <SpinnerComponent message="Loading categories..." /> : null}
                    {error ? <div>{error}</div> : null}
                </div>

                {/* Display categories in a table */}
                {!loading && !error && (
                    <>
                        <Table bordered hover className="mb-1" style={{ width: "auto", margin: "0 auto" }}>
                            <thead className="table-dark">
                                <tr>
                                    <th>Sr.No.</th>
                                    <th>Category Name</th>
                                    <th>View Products</th>
                                    <th>Edit</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCategories.map((category, index) => (
                                    <tr key={category?._id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{category?.categoryName}</td>
                                        <td>
                                            <FaEye
                                                className="text-info"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleViewProducts(category)}
                                            />
                                        </td>
                                        <td>
                                            <FaEdit
                                                className="text-primary"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleEditCategory(category)}
                                            />
                                        </td>
                                        <td>
                                            <FaTrash
                                                className="text-danger"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleDeleteCategory(category._id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Pagination Controls */}
                        <Pagination className="justify-content-center pb-2">
                            <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                            <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

                            {[...Array(totalPages)].map((_, pageIndex) => (
                                <Pagination.Item
                                    key={pageIndex + 1}
                                    active={pageIndex + 1 === currentPage}
                                    onClick={() => paginate(pageIndex + 1)}
                                >
                                    {pageIndex + 1}
                                </Pagination.Item>
                            ))}

                            <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                            <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </>
                )}

                {/* Add/Edit Category Modal */}
                <AddCategoryForm
                    show={showModal}
                    handleClose={handleCloseModal}
                    handleAddCategory={handleAddCategory}
                    selectedCategory={selectedCategory} // Pass selected category for editing
                />
            </Container>
        </motion.div>
    );
};

export default AllCategory;
