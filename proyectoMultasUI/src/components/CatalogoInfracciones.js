import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Importa los estilos de react-toastify
import React, { useState, useEffect } from 'react';
import { FaEdit, FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import '../Styles/CatalogoInfracciones.css';
import HeaderAdmin from './HeaderAdmin';

function CatalogoInfracciones() {
    const [infracciones, setInfracciones] = useState([]);
    const [filteredInfracciones, setFilteredInfracciones] = useState([]); // Lista filtrada
    const [editIndex, setEditIndex] = useState(null);
    const [editedMonto, setEditedMonto] = useState('');
    const [newInfraccion, setNewInfraccion] = useState({ nombre: '', costo: '' });
    const [searchTerm, setSearchTerm] = useState(''); // Estado para el término de búsqueda

    useEffect(() => {
        fetchInfracciones();
    }, []);

    useEffect(() => {
        // Filtrar infracciones basándose en el término de búsqueda
        const filtered = infracciones.filter(infraccion =>
            infraccion.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredInfracciones(filtered);
    }, [searchTerm, infracciones]);

    // Función para obtener las infracciones desde el backend
    const fetchInfracciones = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
            const data = await response.json();
            setInfracciones(data);
            setFilteredInfracciones(data); // Inicialmente, la lista filtrada es igual a la lista completa
        } catch (error) {
            toast.error('No se pudo cargar el catálogo. Intente nuevamente más tarde.');
            console.error("Error al cargar infracciones:", error);
        }
    };

    // Función para iniciar la edición de un monto
    const handleEdit = (index, costo) => {
        setEditIndex(index);
        setEditedMonto(costo);
    };

    // Función para guardar el monto editado en el backend
    const handleSave = async (id) => {
        const parsedMonto = parseFloat(editedMonto);
        if (isNaN(parsedMonto)) {
            toast.warn('El monto debe ser un número válido.');
            return;
        }

        try {
            const response = await fetch(`https://localhost:7201/api/CatalogoInfracciones/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: id,
                    nombre: infracciones.find(inf => inf.id === id).nombre,
                    costo: parsedMonto,
                }),
            });

            if (response.ok) {
                setInfracciones(infracciones.map((inf, index) => (
                    index === editIndex ? { ...inf, costo: parsedMonto } : inf
                )));
                setEditIndex(null);
                setEditedMonto('');
                toast.success('Monto actualizado correctamente.');
            } else {
                toast.error('No se pudo actualizar el monto.');
            }
        } catch (error) {
            toast.error('Error al actualizar el monto.');
            console.error("Error al guardar el monto:", error);
        }
    };

    // Función para agregar una nueva infracción
    const handleAddInfraccion = async (e) => {
        e.preventDefault();

        if (!newInfraccion.nombre || !newInfraccion.costo) {
            toast.warn('Ambos campos son obligatorios.');
            return;
        }

        const parsedMonto = parseFloat(newInfraccion.costo);
        if (isNaN(parsedMonto)) {
            toast.warn('El monto debe ser un número válido.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre: newInfraccion.nombre,
                    costo: parsedMonto,
                }),
            });

            if (response.ok) {
                const createdInfraccion = await response.json();
                setInfracciones([...infracciones, createdInfraccion]);
                setNewInfraccion({ nombre: '', costo: '' });
                toast.success('Infracción agregada exitosamente.');
            } else {
                toast.error('No se pudo agregar la infracción.');
            }
        } catch (error) {
            toast.error('Error al agregar la infracción.');
            console.error("Error al agregar infracción:", error);
        }
    };

    // Función para eliminar una infracción
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://localhost:7201/api/CatalogoInfracciones/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setInfracciones(infracciones.filter(infraccion => infraccion.id !== id));
                toast.success('Infracción eliminada correctamente.');
            } else {
                toast.error('No se pudo eliminar la infracción.');
            }
        } catch (error) {
            toast.error('Error al eliminar la infracción.');
            console.error("Error al eliminar infracción:", error);
        }
    };

    return (
        <div className="catalogo-background">
            <HeaderAdmin regresarRuta="/" tituloPrincipal="Tránsito 360" tituloRegresar="Regresar" />

            <div className="catalogo-infracciones-container">
                <h2>Administrar Catálogo de Infracciones</h2>

                {/* Formulario para agregar una nueva infracción */}
                <form onSubmit={handleAddInfraccion} className="add-infraccion-form">
                    <input
                        type="text"
                        placeholder="Nombre de la infracción"
                        value={newInfraccion.nombre}
                        onChange={(e) => setNewInfraccion({ ...newInfraccion, nombre: e.target.value })}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Monto"
                        value={newInfraccion.costo}
                        onChange={(e) => setNewInfraccion({ ...newInfraccion, costo: e.target.value })}
                        required
                    />
                    <button type="submit" className="add-button"><FaPlus /> Agregar Infracción</button>
                </form>

                {/* Campo de búsqueda debajo del botón agregar */}
                <input
                    type="text"
                    placeholder="Buscar infracción..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                {/* Tabla de infracciones */}
                <table className="infracciones-table">
                    <thead>
                        <tr>
                            <th>Infracción</th>
                            <th>Monto</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInfracciones.length > 0 ? (
                            filteredInfracciones.map((infraccion, index) => (
                                <tr key={infraccion.id}>
                                    <td>{infraccion.nombre}</td>
                                    <td>
                                        {editIndex === index ? (
                                            <input
                                                type="number"
                                                value={editedMonto}
                                                onChange={(e) => setEditedMonto(e.target.value)}
                                                className="edit-input"
                                            />
                                        ) : (
                                            `₡${(infraccion.costo ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                                        )}
                                    </td>
                                    <td>
                                        {editIndex === index ? (
                                            <button
                                                onClick={() => handleSave(infraccion.id)}
                                                className="action-button save-button"
                                            >
                                                <FaSave /> Guardar
                                            </button>
                                        ) : (
                                            <>
                                                <button
                                                    onClick={() => handleEdit(index, infraccion.costo)}
                                                    className="action-button edit-button"
                                                >
                                                    <FaEdit /> Editar
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(infraccion.id)}
                                                    className="action-button edit-button"
                                                >
                                                    <FaTrash /> Eliminar
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="no-data">No se encontraron infracciones.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CatalogoInfracciones;