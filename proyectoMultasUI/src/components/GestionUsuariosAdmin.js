import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import React, { useState, useEffect } from 'react';
import { FaUserPlus, FaUser, FaIdCard, FaEnvelope, FaLock, FaPhoneAlt, FaBriefcase, FaSearch, FaTrash, FaUserEdit } from 'react-icons/fa';
import '../Styles/GestionUsuariosAdmin.css';
import UploadWidget from './UploadWidget';
import HeaderAdmin from './HeaderAdmin';  // Importar el HeaderAdmin

function GestionUsuariosAdmin() {
    const [cedula, setCedula] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [telefono, setTelefono] = useState('');
    const [fotoCedula, setFotoCedula] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [message, setMessage] = useState('');
    const [roles, setRoles] = useState([]);
    const [error, setError] = useState(null);
    const [selectedRoleId, setSelectedRoleId] = useState(null);

    const fetchUsuarios = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/usuarios/NotRole/1');
            const data = await response.json();
            setUsuarios(data);
        } catch (error) {
            console.error("Error al cargar usuarios:", error);
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/Roles');
            const data = await response.json();
            setRoles(data);
        } catch (error) {
            console.error("Error al cargar los roles:", error);
          //  setError("Error al cargar los roles.");
            toast.error('Error al cargar los roles.');

        }
    };

    useEffect(() => {
        fetchUsuarios();
        fetchRoles();
    }, []);

    const getRoleNameById = (id) => {
        const role = roles.find(role => role.id === id);
        return role ? role.nombre : '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const usuarioAdmin = {
                cedula,
                nombre,
                apellido,
                email: correo,
                password: contrasena,
                telefono,
                fotoCedula,
                idRol: selectedRoleId,
            };

            console.log(usuarioAdmin);

            const response = await fetch('https://localhost:7201/api/Auth/Register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify(usuarioAdmin) // Aquí se envía el objeto FormData
            });

            if (response.ok) {
              //  alert('¡Registro exitoso!');
                toast.success('¡Registro exitoso!');
                fetchUsuarios();
                window.location.reload();
            }
            else {
               // alert('Error al registrar el usuario.');
               toast.error('Error al registrar el usuario.');
            }
        } catch (error) {
            console.log(error);
            
        }

        setCedula('');
        setNombre('');
        setApellido('');
        setCorreo('');
        setContrasena('');
        setTelefono('');
        setFotoCedula(null);
    };

    const handleDelete = async (id, email) => {
        try {
            // Delete the user from the api/usuarios endpoint
            const response = await fetch(`https://localhost:7201/api/usuarios/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Delete the user from the DeleteUser endpoint using the email
                const deleteUserResponse = await fetch(`https://localhost:7201/api/Auth/DeleteUser?userName=${email}`, {
                    method: 'DELETE',
                });

                if (deleteUserResponse.ok) {
                    setUsuarios(usuarios.filter(user => user.id !== id));
                    //alert("Usuario eliminado exitosamente.");
                    toast.success('Usuario eliminado exitosamente.');
                } else {
                    //alert("No se pudo eliminar el usuario del sistema de autenticación.");
                 toast.warn('No se pudo eliminar el usuario del sistema de autenticación.');

                }
            } else {
               // setMessage("No se pudo eliminar el usuario.");
                 toast.error('No se pudo eliminar el usuario.');

            }
        } catch (error) {
            console.error("Error al eliminar usuario:", error);
        }
    };

    return (
        <div className="crear-usuario-background">
            {/* Añadir el HeaderAdmin aquí */}
            <HeaderAdmin />  {/* El Header se coloca aquí */}

            <div className="crear-usuario-container">
                <div className="formulario-container">
                    <div className="profile-image">
                        <FaUserPlus size={50} />
                    </div>
                    <h2>Gestionar Usuarios</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="input-icon">
                            <FaIdCard className="icon" />
                            <input type="text" placeholder="Cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} required />
                        </div>
                        <div className="input-icon">
                            <FaUser className="icon" />
                            <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                        </div>
                        <div className="input-icon">
                            <FaUser className="icon" />
                            <input type="text" placeholder="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
                        </div>
                        <div className="input-icon">
                            <FaEnvelope className="icon" />
                            <input type="email" placeholder="Correo Electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                        </div>
                        <div className="input-icon">
                            <FaLock className="icon" />
                            <input type="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />
                        </div>
                        <div className="input-icon">
                            <FaPhoneAlt className="icon" />
                            <input type="tel" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
                        </div>
                        <label>Foto de Cédula:</label>
                        <UploadWidget onUpload={setFotoCedula} />
                        <div className="input-icon">
                            <FaBriefcase className="icon" />
                            <select onChange={(e) => setSelectedRoleId(e.target.value)}>
                                {roles.map(role => (
                                    <option key={role.id} value={role.id}>{role.nombre}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-submit">Agregar Usuario</button>
                    </form>
                    {message && <p className="message">{message}</p>}
                </div>

                {/* Tabla de usuarios */}
                <div className="tabla-usuarios-container">
                <div className="profile-image">
                        <FaUserEdit size={50} />
                    </div>
                    <h2>Lista de Usuarios</h2>
                    <div className="input-icon">
                        <FaSearch className="icon" />
                        <input
                            type="text"
                            placeholder="Buscar usuario por nombre"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-busqueda"
                        />
                    </div>
                    <table className="usuarios-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Correo</th>
                                <th>Rol</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.filter(user => user.nombre.toLowerCase().includes(searchTerm.toLowerCase())).map(user => (
                                <tr key={user.id}>
                                    <td>{user.nombre}</td>
                                    <td>{user.apellido}</td>
                                    <td>{user.correo}</td>
                                    <td>{getRoleNameById(user.idRol)}</td>
                                    <td>
                                        <button onClick={() => handleDelete(user.id, user.correo)} className="delete-button">
                                            <FaTrash /> Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
}

export default GestionUsuariosAdmin;
