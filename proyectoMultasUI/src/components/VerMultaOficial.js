import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useEffect, useState } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import '../Styles/VerMultas.css';
import { useNavigate } from 'react-router-dom';
import HeaderOficial from './HeaderOficial';

function VerMultas() {
    const [multas, setMultas] = useState([]);
    const [filteredMultas, setFilteredMultas] = useState([]); // Multas filtradas
    const [filtro, setFiltro] = useState(''); // Texto del filtro
    const [error, setError] = useState('');
    const [infracciones, setInfracciones] = useState([]);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    useEffect(() => {
        fetchMultas();
        fetchInfracciones();
    }, []);

    // Función para obtener las multas desde el backend
    const fetchMultas = async () => {
        try {
            const response = await fetch(`https://localhost:7201/api/Multas/IdOficial/${userId}`); // Reemplaza con la URL correcta de tu API
            if (!response.ok) {
                throw new Error('Error al cargar las multas');
            }
            const data = await response.json();
            setMultas(data);
            setFilteredMultas(data); // Inicialmente todas las multas están disponibles
        } catch (error) {
            console.error('Error al cargar multas:', error);
            toast.error('No se pudo cargar las multas.');
        }
    };

    // Función para obtener las infracciones desde el backend
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

    // Filtrar multas según el texto ingresado
    useEffect(() => {
        if (filtro.trim() === '') {
            setFilteredMultas(multas); // Si no hay filtro, mostrar todas las multas
        } else {
            setFilteredMultas(
                multas.filter((multa) => {
                    const infraccionesTexto = multa.infraccionMultas
                        .map((infraccion) => {
                            const infraccionDetail = infracciones.find(i => i.id === infraccion.catalogoInfraccionesId);
                            return infraccionDetail ? infraccionDetail.nombre : '';
                        })
                        .join(' ');
                    return (
                        `${multa.cedulaInfractor} ${multa.nombreInfractor} ${multa.apellidoInfractor} ${multa.multaPlacas.map(placa => placa.placasId).join(', ')} ${infraccionesTexto}`
                            .toLowerCase()
                            .includes(filtro.toLowerCase())
                    );
                })
            );
        }
    }, [filtro, multas, infracciones]);

    return (
        <div className="ver-multas-page">
            <HeaderOficial />

            <div className="ver-multas-container">
                <h2><FaExclamationCircle /> Mis Multas Creadas</h2>
                {error && <p className="error-message">{error}</p>}

                {/* Barra de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar por cédula, nombre, placas o infracciones..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="filtro-input"
                />

                <table className="multas-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Cédula</th>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Fecha</th>
                            <th>Placas</th>
                            <th>Infracciones</th>
                            <th>Monto Total</th>
                            <th>Resuelta</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredMultas.length > 0 ? (
                            filteredMultas.map((multa) => (
                                <tr key={multa.id}>
                                    <td>{multa.id}</td>
                                    <td>{multa.cedulaInfractor}</td>
                                    <td>{multa.nombreInfractor}</td>
                                    <td>{multa.apellidoInfractor}</td>
                                    <td>{new Date(multa.fecha).toLocaleDateString()}</td>
                                    <td>{multa.multaPlacas.map(placa => placa.placasId).join(', ')}</td>
                                    <td>
                                        {multa.infraccionMultas.map((infraccion) => {
                                            const infraccionDetail = infracciones.find(i => i.id === infraccion.catalogoInfraccionesId);
                                            return infraccionDetail ? infraccionDetail.nombre : infraccion.catalogoInfraccionesId;
                                        }).map((nombre, index) => (
                                            <span key={index}>
                                                {nombre}
                                                <br />
                                            </span>
                                        ))}
                                    </td>
                                    <td>{`₡${(multa.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                                    <td>{multa.resuelta ? 'Sí' : 'No'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10">No hay multas disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default VerMultas;