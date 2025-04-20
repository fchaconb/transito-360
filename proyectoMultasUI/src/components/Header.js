import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="header-left">
                <button className="nav-button" onClick={() => navigate('/')}>Tránsito 360</button>
                <button className="nav-button" onClick={() => navigate('/NextCodeSolutions')}>
    Next Code Solutions
</button>

            </div>
            <div className="header-right">
                <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
                <button onClick={() => navigate('/register')}>Registrarse</button>
            </div>
        </header>
    );
};

export default Header;
