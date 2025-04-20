import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import ReporteUsuarioFinal from './ReporteUsuarioFinal';
import '../Styles/Dashboard.css';

function DashboardUsuarioFinal() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h2>Usuario Final</h2>
                <button onClick={() => navigate('/ver-multas')} className="sidebar-button">
                    <i className="fas fa-file-invoice"></i> Administrar Multas
                </button>
                <button onClick={() => navigate('/ver-disputas')} className="sidebar-button">
                    <i className="fas fa-clipboard-list"></i> Ver Disputas
                </button>
                <button onClick={() => navigate('/notificaciones')} className="sidebar-button">
                    <i className="fas fa-bell"></i> Notificaciones
                </button>
                <button onClick={() => navigate('/perfil')} className="sidebar-button">
                    <i className="fas fa-user-edit"></i> Editar Perfil
                </button>
                <LogoutButton />
            </aside>

            <main className="main-content">
                <header className="content-header">
                    <h2>Panel - Usuario Final</h2>
                </header>
                <div className="content-body">
                    <p>Bienvenido al panel de usuario final. Aquí puedes ver tus multas, crear disputas y revisar el estado de tus disputas.</p>
                    <ReporteUsuarioFinal />
                </div>
            </main>
        </div>
    );
}

export default DashboardUsuarioFinal;
