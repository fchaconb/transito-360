import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Dashboard.css';
import LogoutButton from './LogoutButton';
import ReporteAdministrativo from './ReporteAdministrativo'; 

function DashboardAdmin() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            {/* Menú lateral */}
            <aside className="sidebar">
                <h2>Administrador</h2>
                <button onClick={() => navigate('/catalogo-infracciones')} className="sidebar-button">
                    <i className="fas fa-book"></i> Administrar Catálogo
                </button>
                <button onClick={() => navigate('/crear-usuario')} className="sidebar-button">
                    <i className="fas fa-user-plus"></i> Gestionar Usuarios
                </button>
                <button onClick={() => navigate('/roles')} className="sidebar-button">
                    <i className="fas fa-users-cog"></i> Gestionar Roles
                </button>
                <button onClick={() => navigate('/perfil-trabajadores')} className="sidebar-button">
                    <i className="fas fa-user-edit"></i> Editar Perfil
                </button>
                <LogoutButton />
            </aside>

            {/* Contenido principal */}
            <main className="main-content">
                <header className="content-header">
                    <h2>Panel - Administrativo</h2>
                </header>
                <div className="content-body">
                    <p>Bienvenido al panel de administración. Aquí puedes gestionar usuarios, roles y el catálogo de infracciones.</p>
                    
                    {/* Componente de reporte administrativo */}
                    <ReporteAdministrativo />
                </div>
            </main>
        </div>
    );
}

export default DashboardAdmin;
