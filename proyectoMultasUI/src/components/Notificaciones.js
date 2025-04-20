import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import React, { useEffect, useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import '../Styles/VerMultas.css';
import { useNavigate } from 'react-router-dom';

function VerNotificaciones() {
    const [notificaciones, setNotificaciones] = useState([]);
    const [error, setError] = useState('');
    const [detailsVisible, setDetailsVisible] = useState({});
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchNotificaciones();
    }, []);

    const fetchNotificaciones = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Notificaciones/UsuarioID/${userId}`);
            if (!response.ok) {
                throw new Error('Error al cargar las notificaciones');
            }
            const data = await response.json();
            setNotificaciones(data);
        } catch (error) {
            console.error('Error al cargar notificaciones:', error);
            toast.error('No se pudo cargar las notificaciones.');
        }
    };

    const handleVerDetallesClick = (idNotificacion) => {
        setDetailsVisible((prevVisible) => ({
            ...prevVisible,
            [idNotificacion]: !prevVisible[idNotificacion]
        }));
    };

    const handleMarcarLeidoClick = async (notificacion) => {
        try {
            const response = await fetch(`https://localhost:7201/api/Notificaciones/${notificacion.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...notificacion, leido: true })
            });
            if (!response.ok) {
                throw new Error('Error al marcar la notificación como leída');
            }
            toast.success('Notificación marcada como leída');
            fetchNotificaciones(); // Refresh notifications
        } catch (error) {
            console.error('Error al marcar la notificación como leída:', error);
            toast.error('No se pudo marcar la notificación como leída.');
        }
    };

    const handleEliminarClick = async (notificacionId) => {
        try {
            const response = await fetch(`https://localhost:7201/api/Notificaciones/${notificacionId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar la notificación');
            }
            toast.success('Notificación eliminada');
            fetchNotificaciones(); // Refresh notifications
        } catch (error) {
            console.error('Error al eliminar la notificación:', error);
            toast.error('No se pudo eliminar la notificación.');
        }
    };

    return (
        <div className="ver-multas-page">
            <div className="ver-multas-container">
                <h2><FaExclamationCircle /> Mis Notificaciones</h2>
                {error && <p className="error-message">{error}</p>}
                <table className="multas-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Fecha</th>
                            <th>Ver Detalles</th>
                            <th>Marcar Leído</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notificaciones.length > 0 ? (
                            notificaciones.map((notificacion) => (
                                <React.Fragment key={notificacion.id}>
                                    <tr>
                                        <td>{notificacion.titulo}</td>
                                        <td>{new Date(notificacion.fecha).toLocaleDateString()}</td>
                                        <td>
                                            <button className='view-button' onClick={() => handleVerDetallesClick(notificacion.id)}>
                                                {detailsVisible[notificacion.id] ? 'Ocultar Detalles' : 'Ver Detalles'}
                                            </button>
                                        </td>
                                        <td>
                                            {!notificacion.leido && (
                                                <button className='view-button' onClick={() => handleMarcarLeidoClick(notificacion)}>
                                                    Marcar Leído
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            <button className='view-button' onClick={() => handleEliminarClick(notificacion.id)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                    {detailsVisible[notificacion.id] && (
                                        <tr className="notificacion-details-row">
                                            <td colSpan="5">
                                                <div className="notificacion-details">
                                                    <p><strong>Descripción:</strong> {notificacion.descripcion}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5">No hay notificaciones disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default VerNotificaciones;