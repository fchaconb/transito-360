import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderAdmin.css';

const HeaderAdmin = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-left">
                <button className="nav-button" onClick={() => window.location.reload()}>Tránsito 360</button>
            </div>
            <div className="header-right">
                {/* El botón Regresar llevará a DashboardAdmin */}
                <button onClick={() => navigate('/admin')}>Regresar</button>
            </div>
        </header>
    );
};

export default HeaderAdmin;
