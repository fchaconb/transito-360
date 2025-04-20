import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaEdit, FaAlignLeft, FaInfoCircle } from 'react-icons/fa';
import '../Styles/CreacionDisputa.css';
import HeaderUsuario from './HeaderUsuario';

function CreacionDisputa() {
    const location = useLocation();
    const multa = location.state?.multa || {};
    const navigate = useNavigate();

    const [razon, setRazon] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [estado, setEstado] = useState('Nueva'); 
    const [message, setMessage] = useState('');
    const [jueces, setJueces] = useState([]);
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        fetchJuecesDisponibles();
    }, []);

    const fetchJuecesDisponibles = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/Usuarios/Role/3');
            if (!response.ok) {
                throw new Error('Error al cargar los jueces');
            }
            const data = await response.json();
            setJueces(data);
        } catch (error) {
            console.error('Error al cargar los jueces:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Randomly pick a judge ID
        const randomJuez = jueces[Math.floor(Math.random() * jueces.length)];

        const disputaData = { 
            razon, 
            descripcion, 
            fecha: new Date().toISOString(),
            estado,
            resolucion: 'Pendiente',
            declaracion: 'Oficial no ha declarado.',
            necesitaDeclaracion: false,
            idMulta: multa.id,
            idUsuarioFinal: userId,
            idOficial: multa.idOficial,
            idJuez: randomJuez.id // Include the randomly picked judge ID
        };

        try {
            const response = await fetch('https://localhost:7201/api/Disputas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(disputaData),
            });

            if (response.ok) {

                const notificacionUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        titulo: `Se ha creado una nueva disputa para la multa ${multa.id}.`,
                        descripcion: `Se ha creado una nueva disputa para la multa ${multa.id}.
                                    Razón: ${razon}.
                                    Descripción: ${descripcion}.`,
                        fecha: new Date().toISOString(),
                        leido: false,
                        idUsuario: userId
                    }),
                });

                const notificacionOficial = await fetch('https://localhost:7201/api/Notificaciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        titulo: `Se ha creado una nueva disputa para la multa ${multa.id}.`,
                        descripcion: `Se ha creado una nueva disputa para la multa ${multa.id}.
                                    Razón: ${razon}.
                                    Descripción: ${descripcion}.`,
                        fecha: new Date().toISOString(),
                        leido: false,
                        idUsuario: multa.idOficial
                    }),
                });

                const notificacionJuez = await fetch('https://localhost:7201/api/Notificaciones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        titulo: `Nueva asignación de disputa para la multa ${multa.id}.`,
                        descripcion: `Se le ha asignado una nueva disputa para la multa ${multa.id}.
                                    Razón: ${razon}.
                                    Descripción: ${descripcion}.`,
                        fecha: new Date().toISOString(),
                        leido: false,
                        idUsuario: randomJuez.id
                    }),
                });

                if (notificacionUsuarioFinal.ok && notificacionOficial.ok && notificacionJuez.ok) {
                    console.log('Notificaciones creadas exitosamente.');
                } else {
                    console.error('Error al crear las notificaciones.');
                }
                //  alert("Disputa creada exitosamente.");
                toast.success('Disputa creada exitosamente.');
                setRazon('');
                setDescripcion('');
                navigate('/ver-disputas');
            } else {
              //  alert("Error al crear la disputa.");
                toast.error('Error al crear la disputa.');
            }
        } catch (error) {
            console.log("Error al conectar con el servidor:", error);
          //  alert("Error de conexión. Intente nuevamente más tarde.");
            toast.error('Error de conexión. Intente nuevamente más tarde.');
        }
    };

    return (
        <div className="crear-disputa-page">
            <HeaderUsuario />
            <div className="crear-disputa-container">
                <h2><FaEdit /> Crear Disputa</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-disputa">
                        <label>
                            <FaInfoCircle className="icon" /> Razón de la Disputa
                        </label>
                        <input
                            type="text"
                            value={razon}
                            onChange={(e) => setRazon(e.target.value)}
                            placeholder="Ingrese la razón de la disputa"
                            required
                        />
                    </div>
                    <div className="form-group-disputa">
                        <label>
                            <FaAlignLeft className="icon" /> Descripción
                        </label>
                        <textarea
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Describa los detalles de la disputa"
                            required
                        ></textarea>
                    </div>
                    <button type="submit" className="btn-submit">Crear Disputa</button>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CreacionDisputa;
