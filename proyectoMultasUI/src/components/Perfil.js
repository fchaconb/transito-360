import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaLock } from 'react-icons/fa';
import LogoutButton from './LogoutButton'; // Componente de logout existente
import UploadWidget from './UploadWidget'; // Import the Cloudinary UploadWidget
import Swal from 'sweetalert2';
import '../Styles/Perfil.css';
import HeaderUsuario from './HeaderUsuario'; // Importamos HeaderUsuario

function Perfil() {
    const [userData, setUserData] = useState({
        id: '',
        cedula: '',
        nombre: '',
        apellido: '',
        correo: '',
        telefono: '',
        fotoCedula: '',
        fotoPerfil: '',
        idRol: '',
        placas: [],
        isTwoFactorEnabled: false
    });
    const [mensaje, setMensaje] = useState('');
    const userId = localStorage.getItem('userId'); 

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`https://localhost:7201/api/usuarios/${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    throw new Error('No se pudo cargar la información del perfil.');
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUserData();
    }, [userId]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://localhost:7201/api/usuarios/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                console.log(userData);
               // alert('Perfil actualizado con éxito.');
                toast.success('Perfil actualizado con éxito.');
                window.location.reload();
            } else {
                throw new Error('No se pudo actualizar el perfil.');
            }
        } catch (error) {
            setMensaje(error.message);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAdministrarPlacas = () => {
        Swal.fire({
            title: 'Administrar Placas',
            html: `
                <div id="placas-container">
                    <div class="swal2-content-placa">
                        <input type="text" id="new-placa-input" class="swal2-input-placa" placeholder="Nueva Placa" />
                        <button id="add-placa-button" class="swal2-button">Agregar</button>
                    </div>
                    <table class="swal2-table-placa">
                        <thead>
                            <tr>
                                <th>Placa</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${userData.placas.map((placa, index) => `
                                <tr class="placa-item" data-index="${index}">
                                    <td>${placa.id}</td>
                                    <td><button class="swal2-button remove-placa-button" data-index="${index}">Eliminar</button></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Guardar Cambios',
            customClass: {
                confirmButton: 'swal2-guardar-button',
            },
            didOpen: () => {
                const addPlacaButton = document.getElementById('add-placa-button');
                const newPlacaInput = document.getElementById('new-placa-input');
                const container = document.querySelector('#placas-container tbody');

                addPlacaButton.addEventListener('click', () => {
                    const newPlaca = newPlacaInput.value;
                    if (newPlaca) {
                        const newPlacaElement = document.createElement('tr');
                        newPlacaElement.className = 'placa-item';
                        newPlacaElement.innerHTML = `
                            <td>${newPlaca}</td>
                            <td><button class="swal2-button remove-placa-button">Eliminar</button></td>
                        `;
                        container.appendChild(newPlacaElement);
                        newPlacaInput.value = '';

                        newPlacaElement.querySelector('.remove-placa-button').addEventListener('click', (e) => {
                            const index = Array.from(container.children).indexOf(newPlacaElement);
                            setUserData(prevState => ({
                                ...prevState,
                                placas: prevState.placas.filter((_, i) => i !== index)
                            }));
                            newPlacaElement.remove();
                        });

                        setUserData(prevState => ({
                            ...prevState,
                            placas: [...prevState.placas, { id: newPlaca }]
                        }));
                    }
                });

                document.querySelectorAll('.remove-placa-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = e.target.getAttribute('data-index');
                        setUserData(prevState => ({
                            ...prevState,
                            placas: prevState.placas.filter((_, i) => i !== parseInt(index))
                        }));
                        e.target.parentElement.parentElement.remove();
                    });
                });
            },
            preConfirm: () => {
                const updatedPlacas = Array.from(document.querySelectorAll('.placa-item')).map(row => ({
                    id: row.querySelector('td').innerText
                }));
                return updatedPlacas;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setUserData(prevState => ({
                    ...prevState,
                    placas: result.value
                }));
            }
        });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault(); // Prevent form submission
        Swal.fire({
            title: 'Cambiar Contraseña',
            html: `
                <input type="password" id="new-password" class="swal2-input" placeholder="Contraseña Nueva" />
                <input type="password" id="confirm-password" class="swal2-input" placeholder="Confirmar Contraseña" />
            `,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Guardar Contraseña',
            customClass: {
                confirmButton: 'swal2-guardar-button'
            },
            preConfirm: () => {
                const newPassword = document.getElementById('new-password').value;
                const confirmPassword = document.getElementById('confirm-password').value;

                if (newPassword !== confirmPassword) {
                    Swal.showValidationMessage('Las contraseñas no coinciden');
                    return false;
                }

                return { newPassword };
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch(`https://localhost:7201/api/Auth/UpdatePassword?userName=${encodeURIComponent(userData.correo)}&newPassword=${encodeURIComponent(result.value.newPassword)}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (response.ok) {
                        Swal.fire('Contraseña actualizada con éxito', '', 'success');
                    } else {
                        throw new Error('No se pudo actualizar la contraseña.');
                    }
                } catch (error) {
                    Swal.fire('Error', error.message, 'error');
                }
            }
        });
    };

    const handleEnable2FA = async (e) => {
        e.preventDefault(); // Prevent form submission
        try {
            const { value: password } = await Swal.fire({
                title: 'Confirmar Contraseña',
                input: 'password',
                inputLabel: 'Por favor, ingrese su contraseña para confirmar',
                inputPlaceholder: 'Contraseña',
                inputAttributes: {
                    autocapitalize: 'off',
                    autocorrect: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Confirmar',
                cancelButtonText: 'Cancelar',
                customClass: {
                    confirmButton: 'swal2-guardar-button'
                }
            });

            if (password) {
                const loginResponse = await fetch('https://localhost:7201/api/Auth/Login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userName: userData.correo,
                        password: password
                    }),
                });

                if (loginResponse.ok) {
                    if (userData.isTwoFactorEnabled) {
                        const disable2FAResponse = await fetch('https://localhost:7201/api/TwoFactorAuth/disable', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: userData.correo,
                                password: password
                            }),
                        });

                        if (disable2FAResponse.ok) {
                            setUserData(prevState => ({
                                ...prevState,
                                isTwoFactorEnabled: false
                            }));
                            Swal.fire('Doble factor de autenticación ha sido deshabilitado.', '', 'success');
                        } else {
                            throw new Error('No se pudo deshabilitar la autenticación de dos factores.');
                        }
                    } else {
                        const enable2FAResponse = await fetch('https://localhost:7201/api/TwoFactorAuth/enable', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: userData.correo,
                                password: password
                            }),
                        });

                        if (enable2FAResponse.ok) {
                            const data = await enable2FAResponse.json();
                            setUserData(prevState => ({
                                ...prevState,
                                isTwoFactorEnabled: true
                            }));
                            Swal.fire({
                                title: 'Escanea el código QR con tu aplicación de autenticación.',
                                html: `<img src="${data.qrCodeBase64}" alt="QR Code" />`,
                                confirmButtonText: 'Cerrar',
                                customClass: {
                                    confirmButton: 'swal2-guardar-button'
                                }
                            });
                        } else {
                            throw new Error('No se pudo habilitar la autenticación de dos factores.');
                        }
                    }
                } else {
                    throw new Error('Contraseña incorrecta.');
                }
            }
        } catch (error) {
            Swal.fire('Error', error.message, 'error');
        }
    };

    return (
        <div className="dashboard-layout-perfil">
            <HeaderUsuario />
            <aside className="sidebar-perfil">
                <h2>Mi Perfil</h2>
                {/* Foto de perfil e información personal en la barra lateral */}
                <div className="perfil-sidebar">
                    <img src={userData.fotoPerfil || 'https://via.placeholder.com/100'} alt="Foto de perfil" className="foto-perfil-lateral" />
                    <p><strong>{userData.nombre} {userData.apellido}</strong></p>
                    <p><FaEnvelope /> {userData.correo}</p>
                    <p><FaPhone /> {userData.telefono}</p>
                </div>
                <button type="button" className="sidebar-button" onClick={handleChangePassword}>
                    <i className="fas fa-key"></i> Cambiar Contraseña
                </button>
                <button type="button" className="sidebar-button" onClick={handleEnable2FA}>
                    <i className="fas fa-shield-alt"></i>{userData.isTwoFactorEnabled ? 'Deshabilitar 2FA' : 'Habilitar 2FA'}
                </button>
                <button type="button" className="sidebar-button" onClick={handleAdministrarPlacas}>
                    <i className="fas fa-id-card"></i>Administrar Placas
                </button>
                <LogoutButton /> {/* Botón de cerrar sesión */}
            </aside>

            <main className="main-content-perfil">
                {/* Foto de perfil con opción de actualización */}
                <div className="foto-perfil">
                        <img src={userData.fotoPerfil || 'https://via.placeholder.com/150'} alt="Foto de perfil" />
                        <UploadWidget onUpload={(url) => setUserData(prevState => ({ ...prevState, fotoPerfil: url }))} /> {/* Cloudinary Upload Widget */}
                    </div>
                <div >
                    

                    {/* Formulario de edición de perfil */}
                    <form onSubmit={handleUpdateProfile} className="perfil-form">
                        <div className="content-body-perfil" >
                            <div className="form-group-perfil">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    className="form-control-perfil"
                                    name="nombre"
                                    value={userData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group-perfil">
                                <label>Apellido</label>
                                <input
                                    type="text"
                                    className="form-control-perfil"
                                    name="apellido"
                                    value={userData.apellido}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group-perfil perfil-form-bottom">
                                <label>Teléfono</label>
                                <input
                                    type="tel"
                                    className="form-control-perfil"
                                    name="telefono"
                                    value={userData.telefono}
                                    onChange={handleChange}
                                    required
                                />
                            </div>    
                        </div>

                        <div className="content-body-perfil secondary-container">     
                                <div className='form-group-perfil'>
                                    <label>Placas Registradas</label>
                                    <textarea
                                        className="placas-textarea"
                                        name="placas"
                                        value={userData.placas.map(placa => placa.id).join('\n')}
                                        readOnly
                                        rows={userData.placas.length}
                                    />
                                </div>
                                <div className="form-group-perfil">
                                    <button type="submit" className="btn-primary-perfil">Guardar Cambios</button>
                                </div>
                        </div>

                    </form>

                    {mensaje && <p className="text-info-perfil">{mensaje}</p>}
                </div>
            </main>
            <ToastContainer />
        </div>
    );
}

export default Perfil;