import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import '../Styles/GestionRoles.css';
import HeaderAdmin from './HeaderAdmin';  // Asegúrate de que esta ruta sea correcta

function GestionRoles() {
    const [roles, setRoles] = useState([]);
    const [nuevoRol, setNuevoRol] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filtro, setFiltro] = useState('');

    useEffect(() => {
        fetchRoles();
    }, []);

    // Función para obtener todos los roles desde el backend
    const fetchRoles = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/Roles');
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error("Error al cargar los roles:", error);
           // setError("Error al cargar los roles.");
            toast.error('Error al cargar los roles.');
        }
    };

    // Función para agregar un nuevo rol
    const handleAddRole = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!nuevoRol.trim()) {
           // setError("El nombre del rol es obligatorio.");
            toast.warn('El nombre del rol es obligatorio.');
            return;
        }

        try {
            const response = await fetch('https://localhost:7201/api/Roles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre: nuevoRol }),
            });

            if (response.ok) {
                const createdRole = await response.json();
                setRoles([...roles, createdRole]);
                setNuevoRol('');
              //  alert("Rol agregado exitosamente.");
                toast.success('Rol agregado exitosamente.');
            } else {
               // setError("No se pudo agregar el rol.");
                toast.console.warn('No se pudo agregar el rol.');
            }
        } catch (error) {
            console.error("Error al agregar el rol:", error);
            //setError("Error al agregar el rol.");
            toast.error('Error al agregar el rol.');
        }
    };

    // Función para eliminar un rol
    const handleDeleteRole = async (id) => {
        setError('');
        setSuccess('');
        try {
            const response = await fetch(`https://localhost:7201/api/Roles/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setRoles(roles.filter(role => role.id !== id));
              //  setSuccess("Rol eliminado exitosamente.");
                toast.success('Rol eliminado exitosamente.');
            } else {
              //  setError("No se pudo eliminar el rol.");
                toast.error('No se pudo eliminar el rol.');
            }
        } catch (error) {
            console.error("Error al eliminar el rol:", error);
           // setError("Error al eliminar el rol.");
            toast.error('Error al eliminar el rol.');

        }
    };

    // Función para filtrar roles
    const handleFilterChange = (e) => {
        setFiltro(e.target.value);
    };

    const rolesFiltrados = roles.filter(role => 
        role.nombre.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <div className="roles-background">
            <HeaderAdmin /> {/* Aquí se agrega el header */}
            <div className="roles-container">
                <h2>Gestión de Roles</h2>
                {error && <p className="error-message">{error}</p>}
                {success && <p className="success-message">{success}</p>}

                {/* Formulario para agregar un nuevo rol */}
                <form onSubmit={handleAddRole} className="form-role">
                    <input
                        type="text"
                        placeholder="Nombre del Rol"
                        value={nuevoRol}
                        onChange={(e) => setNuevoRol(e.target.value)}
                        required
                    />
                    <button type="submit" className="add-button">
                        <FaPlus /> Agregar Rol
                    </button>
                </form>

                {/* Campo de filtrado */}
                <input
                    type="text"
                    placeholder="Filtrar roles"
                    value={filtro}
                    onChange={handleFilterChange}
                    className="filter-input"
                />

                {/* Tabla de roles */}
                <table className="roles-table">
                    <thead>
                        <tr>
                            <th>Nombre del Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rolesFiltrados.length > 0 ? (
                            rolesFiltrados.map((role) => (
                                <tr key={role.id}>
                                    <td>{role.nombre}</td>
                                    <td>
                                        <button
                                            onClick={() => handleDeleteRole(role.id)}
                                            className="delete-button"
                                        >
                                            <FaTrashAlt /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="2" className="no-data">No se encontraron roles.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}

export default GestionRoles;
