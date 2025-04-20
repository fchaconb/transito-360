import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderOficial.css';

const HeaderOficial = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-left">
                <button className="nav-button" onClick={() => window.location.reload()}>Tránsito 360</button>
            </div>
            <div className="header-right">
                {/* El botón Regresar llevará a DashboardJuez */}
                <button onClick={() => navigate('/oficial')}>Regresar</button>
            </div>
        </header>
    );
};

export default HeaderOficial;
