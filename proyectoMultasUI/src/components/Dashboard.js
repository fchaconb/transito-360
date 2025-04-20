import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Dashboard.css';

function Dashboard({ role }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/login');
    };

    // Funciones de navegación para cada botón
    const goToCatalogoInfracciones = () => navigate('/catalogo-infracciones');
    const goToCrearUsuarioAdministrativo = () => navigate('/crear-usuario-administrativo');
    const goToGestionarRoles = () => navigate('/gestionar-roles');
    const goToEditarPerfil = () => navigate('/editar-perfil');
    const goToCrearMulta = () => navigate('/crear-multa');
    const goToVerMultas = () => navigate('/ver-multas');
    const goToIniciarDisputa = () => navigate('/iniciar-disputa');

    return (
        <div className="dashboard-background">
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h2>Dashboard - {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
                    <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
                </header>
                
                <main className="dashboard-content">
                    {/* Botones específicos para el administrador */}
                    {role === 'admin' && (
                        <>
                            <button onClick={goToCatalogoInfracciones} className="btn-dashboard">Administrar Catálogo de Infracciones</button>
                            <button onClick={goToCrearUsuarioAdministrativo} className="btn-dashboard">Crear Usuario Administrativo</button>
                            <button onClick={goToGestionarRoles} className="btn-dashboard">Gestionar Roles</button>
                        </>
                    )}

                    {/* Botones específicos para el oficial */}
                    {role === 'oficial' && (
                        <>
                            <button onClick={goToCatalogoInfracciones} className="btn-dashboard">Ver Catálogo de Infracciones</button>
                            <button onClick={goToCrearMulta} className="btn-dashboard">Crear Multa</button>
                        </>
                    )}

                    {/* Botones específicos para el usuario final */}
                    {role === 'usuario' && (
                        <>
                            <button onClick={goToVerMultas} className="btn-dashboard">Ver Multas</button>
                            <button onClick={goToIniciarDisputa} className="btn-dashboard">Iniciar Disputa</button>
                        </>
                    )}

                    {/* Botones específicos para el juez */}
                    {role === 'juez' && (
                        <>
                            <button onClick={goToIniciarDisputa} className="btn-dashboard">Gestionar Disputas</button>
                            <button onClick={goToVerMultas} className="btn-dashboard">Ver Multas</button>
                        </>
                    )}

                    {/* Botones comunes para todos los roles */}
                    <button onClick={goToEditarPerfil} className="btn-dashboard">Editar Perfil</button>
                </main>
            </div>
        </div>
    );
}

export default Dashboard;
