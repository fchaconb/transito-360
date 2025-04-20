import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { FaBook } from 'react-icons/fa';
import '../Styles/CatalogoInfraccionesOficial.css';
import HeaderOficial from './HeaderOficial'; // Importamos HeaderOficial

function CatalogoInfraccionesOficial() {
    const [infracciones, setInfracciones] = useState([]);
    const [filteredInfracciones, setFilteredInfracciones] = useState([]); // Estado para infracciones filtradas
    const [filtro, setFiltro] = useState(''); // Texto del filtro
    const [error, setError] = useState('');

    useEffect(() => {
        fetchInfracciones();
    }, []);

    // Función para obtener las infracciones desde el backend
    const fetchInfracciones = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
            const data = await response.json();
            setInfracciones(data);
            setFilteredInfracciones(data); // Inicialmente todas las infracciones están disponibles
        } catch (error) {
            console.error("Error al cargar el catálogo de infracciones:", error);
            toast.error('No se pudo cargar el catálogo. Intente nuevamente más tarde.');
        }
    };

    // Filtrar infracciones según el texto ingresado
    useEffect(() => {
        if (filtro.trim() === '') {
            setFilteredInfracciones(infracciones); // Si no hay filtro, mostrar todas las infracciones
        } else {
            setFilteredInfracciones(
                infracciones.filter((infraccion) =>
                    `${infraccion.nombre} ${infraccion.costo}`
                        .toLowerCase()
                        .includes(filtro.toLowerCase())
                )
            );
        }
    }, [filtro, infracciones]);

    return (
        <div className="catalogo-infracciones-oficial-page">
            <HeaderOficial />
            <div className="catalogo-infracciones-oficial-container">
                <h2><FaBook /> Catálogo de Infracciones</h2>
                {error && <p className="error-message">{error}</p>}

                {/* Barra de búsqueda */}
                <input
                    type="text"
                    placeholder="Buscar infracción por nombre o monto..."
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                    className="filtro-input"
                />

                <table className="infracciones-table">
                    <thead>
                        <tr>
                            <th>Infracción</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInfracciones.length > 0 ? (
                            filteredInfracciones.map((infraccion) => (
                                <tr key={infraccion.id}>
                                    <td>{infraccion.nombre}</td>
                                    <td>{`₡${(infraccion.costo ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="no-data">No se encontraron infracciones.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CatalogoInfraccionesOficial;