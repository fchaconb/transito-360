import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import './VerDeclaraciones.css';
import HeaderOficial from './HeaderOficial'; // Importa el Header del Oficial

function VerDeclaraciones() {
    const [disputas, setDisputas] = useState([]);
    const [declaraciones, setDeclaraciones] = useState({});
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [expandedDisputaId, setExpandedDisputaId] = useState(null);
    const [detailsVisible, setDetailsVisible] = useState({});
    const [multaDetails, setMultaDetails] = useState({});
    const [infracciones, setInfracciones] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        // Comentar o eliminar el fetch real para usar datos quemados
         const fetchDisputas = async () => {
            try {
                const response = await fetch(`https://localhost:7201/api/Disputas/IdOficial/${userId}/NeedsDeclaration`);
                if (!response.ok) throw new Error('No se pudo cargar la lista de disputas.');
                
                const data = await response.json();
                setDisputas(data);
            } catch (err) {
                console.error("Error al cargar disputas:", err);
              //  setError('No se pudieron cargar las disputas.');
                toast.error('No se pudieron cargar las disputas.');
            }
        };
        fetchDisputas(); 
        fetchInfracciones();
    }, []);

    const toggleExpandDisputa = (id) => {
        setExpandedDisputaId(expandedDisputaId === id ? null : id);
    };

    const notificacionCambioDeEstado = async (idUsuario, disputaID) => {
        const notificacionUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: `Oficial ha actualizado una disputa`,
                descripcion: `El oficial ha actualizado la disputa ${disputaID}.`,
                fecha: new Date().toISOString(),
                leido: false,
                idUsuario: idUsuario
            }),
        });

        if (notificacionUsuarioFinal.ok) {
            console.log('Notificación creada exitosamente.');
        } else {
            console.error('Error al crear la notificación.');
        }
    }

    const handleEnviarDeclaracion = async (idDisputa) => {
        try {
            const declaracion = declaraciones[idDisputa] || '';
            const disputa = disputas.find(d => d.id === idDisputa);
            const updatedDisputa = { ...disputa, declaracion, estado: 'Declaración Recibida', necesitaDeclaracion: false };

            const response = await fetch(`https://localhost:7201/api/Disputas/${idDisputa}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDisputa),
            });

            if (response.ok) {
                notificacionCambioDeEstado(disputa.idUsuarioFinal, disputa.id);
                notificacionCambioDeEstado(disputa.idJuez, disputa.id);

               // alert('Declaración enviada con éxito.');
                toast.success('Declaración enviada con éxito.');
                setDisputas(disputas.map(d => d.id === idDisputa ? updatedDisputa : d));
                setDeclaraciones((prev) => ({ ...prev, [idDisputa]: '' }));
                window.location.reload(); // Reload the page
            } else {
                throw new Error('No se pudo actualizar la disputa.');
            }
        } catch (err) {
            console.error("Error al enviar declaración:", err);
        //    setError('No se pudo enviar la declaración.');
            toast.error('No se pudo enviar la declaración.');
        }
    };

    const handleChangeDeclaracion = (idDisputa, value) => {
        setDeclaraciones((prev) => ({ ...prev, [idDisputa]: value }));
    };

    const fetchInfracciones = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
            if (!response.ok) {
                throw new Error('Error al cargar las infracciones');
            }
            const data = await response.json();
            setInfracciones(data);
        } catch (error) {
            console.error('Error al cargar infracciones:', error);
        }
    };

    const fetchMultaDetails = async (idMulta) => {
        try {
            const response = await fetch(`https://localhost:7201/api/Multas/${idMulta}`);
            if (!response.ok) throw new Error('No se pudo cargar los detalles de la multa.');
            
            const data = await response.json();
            setMultaDetails((prevDetails) => ({
                ...prevDetails,
                [idMulta]: data
            }));
        } catch (error) {
            console.error('Error fetching multa details:', error);
        }
    };

    const handleVerDetallesClick = (idMulta) => {
        setDetailsVisible((prevVisible) => ({
            ...prevVisible,
            [idMulta]: !prevVisible[idMulta]
        }));
        if (!detailsVisible[idMulta]) {
            fetchMultaDetails(idMulta);
        }
    };

    return (
        <div className="ver-declaraciones-background">
            <HeaderOficial />

            <div className="shape-background"></div>
            <div className="ver-declaraciones-container">
                <h2><FaExclamationTriangle /> Disputas Pendientes por Declarar</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}
                
                <table className="ver-declaraciones-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Razón</th>
                            <th>Descripción</th>
                            <th>Estado</th>
                            <th>Resolución</th>
                            <th>Multa</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {disputas.length > 0 ? (
                            disputas.map((disputa) => (
                                <React.Fragment key={disputa.id}>
                                    <tr>
                                        <td>{disputa.id}</td>
                                        <td>{disputa.razon}</td>
                                        <td>{disputa.descripcion}</td>
                                        <td>{disputa.estado}</td>
                                        <td>{disputa.resolucion}</td>
                                        <td>
                                            <button className='resolver-button' onClick={() => handleVerDetallesClick(disputa.idMulta)}>
                                                {detailsVisible[disputa.idMulta] ? 'Ocultar Detalles' : 'Ver Detalles'}
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="resolver-button"
                                                onClick={() => toggleExpandDisputa(disputa.id)}
                                            >
                                                Declarar
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedDisputaId === disputa.id && (
                                        <tr className="declaracion-row">
                                            <td colSpan="7">
                                                <textarea
                                                    value={declaraciones[disputa.id] || ''}
                                                    onChange={(e) => handleChangeDeclaracion(disputa.id, e.target.value)}
                                                    placeholder="Escriba su declaración aquí..."
                                                    className="declaracion-textarea"
                                                />
                                                <button
                                                    className="send-button"
                                                    onClick={() => handleEnviarDeclaracion(disputa.id)}
                                                >
                                                    Enviar
                                                </button>
                                            </td>
                                        </tr>
                                    )}
                                    {detailsVisible[disputa.idMulta] && multaDetails[disputa.idMulta] && (
                                        <tr className="multa-details-row">
                                            <td colSpan="7">
                                                <div className="multa-details">
                                                    <p><strong>ID Multa:</strong> {multaDetails[disputa.idMulta].id}</p>
                                                    <p><strong>Cédula Infractor:</strong> {multaDetails[disputa.idMulta].cedulaInfractor}</p>
                                                    <p><strong>Nombre Completo:</strong> {`${multaDetails[disputa.idMulta].nombreInfractor} ${multaDetails[disputa.idMulta].apellidoInfractor}`}</p>
                                                    <p><strong>Fecha:</strong> {new Date(multaDetails[disputa.idMulta].fecha).toLocaleDateString()}</p>
                                                    <p><strong>Placa:</strong> {multaDetails[disputa.idMulta].multaPlacas ? multaDetails[disputa.idMulta].multaPlacas.map(placa => placa.placasId).join(', ') : 'N/A'}</p>
                                                    <p><strong>Infracciones:</strong></p>
                                                    <ul>
                                                        {multaDetails[disputa.idMulta].infraccionMultas ? multaDetails[disputa.idMulta].infraccionMultas.map(infraccion => {
                                                            const infraccionDetail = infracciones.find(i => i.id === infraccion.catalogoInfraccionesId);
                                                            return (
                                                                <li key={infraccion.catalogoInfraccionesId}>
                                                                    {infraccionDetail ? infraccionDetail.nombre : infraccion.catalogoInfraccionesId}
                                                                </li>
                                                            );
                                                        }) : <li>N/A</li>}
                                                    </ul>
                                                    <p><strong>Monto Total:</strong> ₡{(multaDetails[disputa.idMulta].total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">No hay disputas pendientes por declarar.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default VerDeclaraciones;