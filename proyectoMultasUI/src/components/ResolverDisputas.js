import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaGavel } from 'react-icons/fa';
import Swal from 'sweetalert2';
import '../Styles/ResolverDisputas.css';
import HeaderJuez from './HeaderJuez'; 

function ResolverDisputas() {
    const [disputas, setDisputas] = useState([]);
    const [error, setError] = useState('');
    const [selectedDisputa, setSelectedDisputa] = useState(null);
    const [newStatus, setNewStatus] = useState('');
    const [detailsVisible, setDetailsVisible] = useState({});
    const [multaDetails, setMultaDetails] = useState({});
    const [officialDetails, setOfficialDetails] = useState({});
    const [infracciones, setInfracciones] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchDisputas();
        fetchInfracciones();
    }, [userId]);

    const fetchDisputas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Disputas/IdJuez/${userId}/NotResolved`);
            if (!response.ok) throw new Error('No se pudo cargar la lista de disputas.');
            
            const data = await response.json();
            setDisputas(data);
        } catch (err) {
            console.error("Error al cargar disputas:", err);
           // setError('No se pudieron cargar las disputas.');
            toast.error('No se pudieron cargar las disputas.');
        }
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
            fetchOfficialDetails(data.idOficial);
        } catch (error) {
            console.error('Error fetching multa details:', error);
        }
    };

    const fetchOfficialDetails = async (idOficial) => {
        try {
            const response = await fetch(`https://localhost:7201/api/Usuarios/${idOficial}`);
            if (!response.ok) throw new Error('No se pudo cargar los detalles del oficial.');
            
            const data = await response.json();
            setOfficialDetails((prevDetails) => ({
                ...prevDetails,
                [idOficial]: data
            }));
        } catch (error) {
            console.error('Error fetching official details:', error);
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

    const notificacionCambioDeEstado = async (idUsuario, disputaID) => {
        const notificacionUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: `Cambio de estado de disputa.`,
                descripcion: `Ha habido un cambio de estado de la disputa ${disputaID}.`,
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

    const notificacionNecesitaDeclaracion = async (idUsuario, disputaID) => {
        const notificacionUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: `Necesita declaración para disputa.`,
                descripcion: `Se necesita una declaración para la disputa ${disputaID}.`,
                fecha: new Date().toISOString(),
                leido: false,
                idUsuario: idUsuario
            }),
        });

        if (notificacionUsuarioFinal.ok) {
            console.log('Notificación creada exitosamente.');
        }
        else {
            console.error('Error al crear la notificación.');
        }
    }

    const handleUpdateDisputa = async (disputa, estado, necesitaDeclaracion, resolucion) => {
        const { id, razon, descripcion, fecha, declaracion, idMulta, idUsuarioFinal, idOficial, idJuez } = disputa;
        const disputaData = {
            id, 
            razon, 
            descripcion, 
            fecha,
            estado,
            resolucion,
            necesitaDeclaracion,
            declaracion,
            idMulta,
            idUsuarioFinal,
            idOficial,
            idJuez,
        };

        try {
            const response = await fetch(`https://localhost:7201/api/Disputas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(disputaData),
            });

            if (response.ok) {

                notificacionCambioDeEstado(idUsuarioFinal, disputaData.id);
                notificacionCambioDeEstado(idJuez, disputaData.id);
                
               // alert("¡Disputa actualizada con éxito!");
                toast.success('¡Disputa actualizada con éxito!');
                setDisputas(disputas.map(d => 
                    d.id === id ? { ...d, estado, resolucion } : d
                ));
                setSelectedDisputa(null);
                setNewStatus('');

                if (resolucion === 'Anulación de Multa') {
                    const multaResponse = await fetch(`https://localhost:7201/api/Multas/${idMulta}`);
                    if (!multaResponse.ok) throw new Error('No se pudo cargar los detalles de la multa.');

                    const multaData = await multaResponse.json();
                    multaData.resuelta = true;

                    const updateMultaResponse = await fetch(`https://localhost:7201/api/Multas/${idMulta}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(multaData),
                    });

                    if (!updateMultaResponse.ok) throw new Error('No se pudo actualizar la multa.');
                }

            } else {
             //   setError('No se pudo actualizar el estado de la disputa.');
                toast.error('No se pudo actualizar el estado de la disputa.');
            }
        } catch (error) {
            console.error("Error al actualizar disputa:", error);
           // setError('Error al actualizar el estado de la disputa.');
            toast.error('Error al actualizar el estado de la disputa.');
        }
    };

    const handleResolverClick = (disputa) => {
        Swal.fire({
            title: 'Resolver Disputa',
            html: `
                <select id="resolution-dropdown" class="swal2-select">
                    <option value="Pendiente" disabled selected>Pendiente</option>
                    <option value="Anulación de Multa">Anulación de Multa</option>
                    <option value="Multa Validada">Multa Validada</option>
                </select>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Resolver Disputa',
            customClass: {
                confirmButton: 'swal2-confirm-button',
            },
            preConfirm: () => {
                const resolution = Swal.getPopup().querySelector('#resolution-dropdown').value;
                return { resolution };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                handleUpdateDisputa(disputa, 'Resuelta', disputa.necesitaDeclaracion, result.value.resolution);
            }
        });
    };

    return (
        <div className="ver-disputas-background">
            <HeaderJuez />

            <div className="ver-disputas-container">
                <h2><FaGavel /> Lista de Disputas</h2>
                {error && <p className="error-message">{error}</p>}
                <table className="ver-disputas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Razón</th>
                            <th>Descripción</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Resolución</th>
                            <th>Detalles de Multa</th>
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
                                        <td>{new Date(disputa.fecha).toLocaleDateString()}</td>
                                        <td>{disputa.estado}</td>
                                        <td>{disputa.resolucion}</td>
                                        <td>
                                            <button className='resolver-button' onClick={() => handleVerDetallesClick(disputa.idMulta)}>
                                                {detailsVisible[disputa.idMulta] ? 'Ocultar Detalles' : 'Ver Detalles'}
                                            </button>
                                        </td>
                                        <td>
                                            <button className="resolver-button" onClick={() => {
                                                handleUpdateDisputa(disputa, 'Esperando Declaración del Oficial', true ,disputa.resolucion);
                                                notificacionNecesitaDeclaracion(disputa.idOficial, disputa.id);
                                            }}>
                                                Solicitar Declaración
                                            </button>
                                            <button className="resolver-button" onClick={() => handleResolverClick(disputa)}>
                                                Resolver
                                            </button>
                                        </td>
                                    </tr>
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
                                                    <p><strong>Nombre del Oficial:</strong> {officialDetails[multaDetails[disputa.idMulta].idOficial] ? `${officialDetails[multaDetails[disputa.idMulta].idOficial].nombre} ${officialDetails[multaDetails[disputa.idMulta].idOficial].apellido}` : 'N/A'}</p>
                                                    <p><strong>Declaracion del Oficial:</strong> {disputa.declaracion}</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="no-data">No se encontraron disputas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default ResolverDisputas;