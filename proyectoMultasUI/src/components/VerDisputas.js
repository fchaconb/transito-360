import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import '../Styles/VerDisputas.css';
import HeaderUsuario from './HeaderUsuario';

function VerDisputas() {
    const [disputas, setDisputas] = useState([]);
    const [error, setError] = useState('');
    const [detailsVisible, setDetailsVisible] = useState({});
    const [multaDetails, setMultaDetails] = useState({});
    const [officialDetails, setOfficialDetails] = useState({});
    const [infracciones, setInfracciones] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchDisputas();
        fetchInfracciones();
    }, []);

    const fetchDisputas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Disputas/IdInfractor/${userId}`);
            if (!response.ok) throw new Error('No se pudo cargar la lista de disputas.');
            
            const data = await response.json();
            setDisputas(data);
        } catch (err) {
            console.error("Error al cargar disputas:", err);
         //   setError('No se pudieron cargar las disputas.');
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

    return (
        <div className="ver-disputas-background">
            <HeaderUsuario />
            <div className="shape-background"></div>
            <div className="ver-disputas-container">
                <h2><FaExclamationTriangle /> Lista de Disputas</h2>
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
                            <th>Ver Información de Multa</th>
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
                                            <button className='view-button' onClick={() => handleVerDetallesClick(disputa.idMulta)}>
                                                {detailsVisible[disputa.idMulta] ? 'Ocultar Detalles' : 'Ver Detalles'}
                                            </button>
                                        </td>
                                    </tr>
                                    {detailsVisible[disputa.idMulta] && multaDetails[disputa.idMulta] && (
                                        <tr className="multa-details-row">
                                            <td colSpan="5">
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
                                <td colSpan="5" className="no-data">No se encontraron disputas.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default VerDisputas;