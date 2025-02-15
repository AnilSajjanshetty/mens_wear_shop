import React, { useState, useEffect } from 'react';
import { Container, Button, Table, Pagination } from 'react-bootstrap';
import CustomerNavbar from "../components/CustomerNavbar";
import { motion } from "framer-motion";
import AddCategoryForm from '../components/AddCategoryForm';
import axios from 'axios';
import SpinnerComponent from '../components/SpinnerComponent';
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"; // Import icons
import config from "../../config"
import { useNavigate } from 'react-router-dom';
const UserAllCategory = () => {
    const server = config.server
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState(null); // Store category to edit
    const itemsPerPage = 10;



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
        navigate(`/user/category/${categoryId}`);

    }
    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8 } }}
            style={{ minHeight: "100vh", background: "linear-gradient(135deg, #ff512f, #dd2476)", padding: "1.25rem", }}
        >
            <CustomerNavbar />
            <Container>
                <h2>Dress Categories</h2>
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


            </Container>
        </motion.div>
    );
};

export default UserAllCategory;
