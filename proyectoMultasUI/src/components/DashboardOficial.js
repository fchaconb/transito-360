import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import ReporteOficial from './ReporteOficial'; // Importamos el componente
import '../Styles/Dashboard.css';

function DashboardOficial() {
    const navigate = useNavigate();

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <h2>Oficial</h2>
                <button onClick={() => navigate('/catalogo-infracciones-oficial')} className="sidebar-button">
                    <i className="fas fa-book"></i> Ver Catálogo
                </button>
                <button onClick={() => navigate('/crear-multa')} className="sidebar-button">
                    <i className="fas fa-file-alt"></i> Crear Multa
                </button>
                <button onClick={() => navigate('/ver-multa-oficial')} className="sidebar-button">
                    <i className="fas fa-file-alt"></i> Ver Multas Creadas
                </button>
                <button onClick={() => navigate('/Ver-Declaraciones')} className="sidebar-button">
                    <i className="fas fa-file-alt"></i> Ver Declaraciones
                </button>
                <button onClick={() => navigate('/notificaciones')} className="sidebar-button">
                    <i className="fas fa-bell"></i> Notificaciones
                </button>
                <button onClick={() => navigate('/perfil-trabajadores')} className="sidebar-button">
                    <i className="fas fa-user-edit"></i> Editar Perfil
                </button>
                <LogoutButton />
            </aside>

            <main className="main-content">
                <header className="content-header">
                    <h2>Panel - Oficial</h2>
                </header>
                <div className="content-body">
                    <p>Bienvenido al panel de oficial. Aquí puedes gestionar multas y ver el catálogo de infracciones.</p>
                    
                    {/* Añadir el componente de ReporteOficial */}
                    <ReporteOficial />
                </div>
            </main>
        </div>
    );
}

export default DashboardOficial;
