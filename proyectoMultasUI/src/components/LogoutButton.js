import React from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutButton() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    return (
        <button className="dashboard-logout-button" onClick={handleLogout}>
            Cerrar Sesión
        </button>
    );
}

export default LogoutButton;