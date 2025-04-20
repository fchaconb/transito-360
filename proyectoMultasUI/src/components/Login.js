import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Importa los estilos de react-toastify
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Importa el componente Header
import './Header.css'; // Importa el CSS del Header
import '../Styles/Login.css';
import Swal from 'sweetalert2'; // Importa SweetAlert2

function Login() {
    const [userName, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:7201/api/Auth/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userName, password }),
            });

            if (!response.ok) {
                toast.error('Usuario o contraseña incorrectos');
                return;
            }

            const data = await response.json();
            console.log('Datos recibidos:', data);
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('userId', data.userId);

            console.log('Rol:', data.role, 'ID:', data.userId);

            // Check if two-factor authentication is enabled
            const userResponse = await fetch(`https://localhost:7201/api/Usuarios/${data.userId}`);
            const userData = await userResponse.json();

            if (userData.isTwoFactorEnabled) {
                Swal.fire({
                    title: 'Por favor ingresa el código de autenticación.',
                    html: `
                        <input type="text" id="totpCode" class="swal2-input-placa" placeholder="Código de autenticación" />
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'Ingresar',
                    customClass: {
                        confirmButton: 'swal2-guardar-button',
                    },
                    preConfirm: () => {
                        const totpCode = Swal.getPopup().querySelector('#totpCode').value;
                        if (!totpCode) {
                            Swal.showValidationMessage('Por favor ingresa el código de autenticación');
                        }
                        return { totpCode };
                    }
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        const { totpCode } = result.value;
                        const verifyResponse = await fetch('https://localhost:7201/api/TwoFactorAuth/validate', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ email: userName, totpCode }),
                        });

                        if (verifyResponse.ok) {
                            navigateToDashboard(data.role);
                        } else {
                            toast.error('Código de autenticación incorrecto');
                        }
                    }
                });
            } else {
                navigateToDashboard(data.role);
            }
        } catch (error) {
            alert(error.message);
        }
    };

    const navigateToDashboard = (role) => {
        if (role === 'Administrativo') {
            navigate('/admin');
        } else if (role === 'UsuarioFinal') {
            navigate('/usuario');
        } else if (role === 'Oficial') {
            navigate('/oficial');
        } else if (role === 'Juez') {
            navigate('/juez');
        } else {
            console.error('Rol no reconocido:', role);
            toast.error('Rol de usuario no reconocido.');
        }
    };

    const handleTestLogin = (role) => {
        localStorage.setItem('token', 'fakeToken');
        localStorage.setItem('role', role);
        navigateToDashboard(role);
    };

    return (
        <div className="login-background">
            <Header /> {/* Agrega el Header aquí */}
            <div className="shape-background"></div>
            <div className="login-container">
                <div className="profile-image">
                    <i className="fas fa-user-circle"></i>
                </div>
                <div className="login-header">
                    <h2>Mi Cuenta</h2>
                </div>
                <form onSubmit={handleLogin}>
                    <div className="form-group-login">
                        <div className="input-icon">
                            <i className="fas fa-user"></i>
                            <input
                                type="email"
                                placeholder="Correo electrónico"
                                className="form-control"
                                value={userName}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="form-group-login">
                        <div className="input-icon">
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                placeholder="Contraseña"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="text-danger">{error}</p>}
                    <button type="submit" className="btn-login">Iniciar Sesión</button>
                    <button
                        type="button"
                        className="btn-link"
                        onClick={() => navigate('/forgot-password')}
                    >
                        ¿Olvidaste tu contraseña?
                    </button>
                </form>

            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
