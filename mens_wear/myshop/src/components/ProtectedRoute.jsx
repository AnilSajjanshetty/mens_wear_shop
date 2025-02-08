import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element, allowedRoles }) => {
    const roleId = Number(localStorage.getItem("roleId")); // Convert roleId to a number

    if (!allowedRoles.includes(roleId)) {
        return <Navigate to="/" replace />; // Redirect if not authorized
    }

    return element;
};

export default ProtectedRoute;
