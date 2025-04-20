import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }) {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // Si el usuario no tiene token o el rol del usuario no está autorizado
    if (!token || (Array.isArray(role) ? !role.includes(userRole) : userRole !== role)) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;
