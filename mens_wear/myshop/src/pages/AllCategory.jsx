import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Pagination } from 'react-bootstrap';
import NavbarComponent from '../components/NavbarComponent';
import { motion } from 'framer-motion';
import AddCategoryForm from '../components/AddCategoryForm';
import SpinnerComponent from '../components/SpinnerComponent';
import { FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import config from '../../config';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const AllCategory = () => {
    const server = config.server;
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get(`/get-category`);
                setCategories(response.data || []);
            } catch (err) {
                setError('Failed to fetch categories');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [showModal]);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCategory(null);
    };

    const handleShowModal = () => setShowModal(true);

    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        handleShowModal();
    };

    const handleDeleteCategory = async (categoryId) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosInstance.delete(`/delete-category/${categoryId}`);
                    setCategories(categories.filter(category => category._id !== categoryId));
                    Swal.fire('Deleted!', 'Category has been deleted.', 'success');
                } catch (error) {
                    Swal.fire('Error!', 'Failed to delete category.', 'error');
                }
            }
        });
    };

    const handleViewProducts = (category) => {
        const categoryId = category._id
        navigate(`/admin/category/${categoryId}`);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCategories = categories.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #ff512f, #dd2476)', padding: '1.25rem' }}
        >
            <NavbarComponent />
            <Container>
                <h2>Manage Categories</h2>
                <Button className="btn btn-primary" onClick={handleShowModal}>Add Category</Button>
                <div className="mt-4 text-center">
                    {loading && <SpinnerComponent message="Loading categories..." />}
                    {error && <div>{error}</div>}
                </div>
                {!loading && !error && (
                    <>
                        <Table bordered hover className="mb-1" style={{ width: 'auto', margin: '0 auto' }}>
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
                                            <FaEye className="text-info" style={{ cursor: 'pointer' }} onClick={() => handleViewProducts(category)} />
                                        </td>
                                        <td>
                                            <FaEdit className="text-primary" style={{ cursor: 'pointer' }} onClick={() => handleEditCategory(category)} />
                                        </td>
                                        <td>
                                            <FaTrash className="text-danger" style={{ cursor: 'pointer' }} onClick={() => handleDeleteCategory(category._id)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
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
                <AddCategoryForm show={showModal} handleClose={handleCloseModal} selectedCategory={selectedCategory} />
            </Container>
        </motion.div>
    );
};

export default AllCategory;
