import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaUser, FaCalendarAlt, FaMapMarkerAlt, FaIdCard } from 'react-icons/fa';
import '../Styles/CrearMulta.css';
import HeaderOficial from './HeaderOficial';

function CrearMulta() {
    const [placasId, setIdPlaca] = useState('');
    const [nombreInfractor, setNombreInfractor] = useState('');
    const [apellidoInfractor, setApellidoInfractor] = useState('');
    const [cedulaInfractor, setCedulaInfractor] = useState('');
    const [longitud, setLongitud] = useState('');
    const [latitud, setLatitud] = useState('');
    const [fecha, setFecha] = useState('');
    const [infraccion, setInfraccion] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedInfracciones, setSelectedInfracciones] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [selectedPosition, setSelectedPosition] = useState([9.932358, -84.07963]); // Coordenadas iniciales de Costa Rica
    const userId = localStorage.getItem('userId');

    const markerIcon = new L.Icon({
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        iconSize: [25, 41],
        iconAnchor: [12, 41]
    });

    const fetchInfractions = async () => {
        try {
            const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
            if (response.ok) {
                const data = await response.json();
                setInfraccion(data);
            } else {
                throw new Error('No se pudo cargar la información de las infracciones.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchInfractions();
    }, []);

    // Buscar la ubicación actual del usuario y centrar el mapa en ella
    const searchLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLatitud(latitude);
                    setLongitud(longitude);
                    setSelectedPosition([latitude, longitude]);
                },
                (error) => {
                    console.error('Error al obtener la ubicación:', error);
                }
            );
        } else {
            console.error('La geolocalización no es compatible con este navegador.');
        }
    };

    const checkUserExists = async (cedula) => {
        try {
            const response = await fetch(`https://localhost:7201/api/Usuarios/Cedula/${cedula}`);
            if (response.ok) {
                const user = await response.json();
                return user; // Assuming the user object has an 'id' property
            } else {
                return null;
            }
        } catch (error) {
            console.log('Error checking user:', error);
            return null;
        }
    };

    const checkAndAddPlaca = async (placasId) => {
        try {
            // Check if the placa exists
            const response = await fetch(`https://localhost:7201/api/Placas/${placasId}`);
            if (response.ok) {
                // Placa exists
                return true;
            } else if (response.status === 404) {
                // Placa does not exist, add it
                const addResponse = await fetch('https://localhost:7201/api/Placas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: placasId })
                });
                return addResponse.ok;
            } else {
                throw new Error('Error checking placa');
            }
        } catch (error) {
            console.log('Error checking or adding placa:', error);
            return false;
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            if (cedulaInfractor) {
                const user = await checkUserExists(cedulaInfractor);
                if (user) {
                    setNombreInfractor(user.nombre); // Assuming the user object has a 'nombre' property
                    setApellidoInfractor(user.apellido); // Assuming the user object has an 'apellido' property
                } else {
                    setNombreInfractor('');
                    setApellidoInfractor('');
                }
            }
        };

        fetchUserData();
    }, [cedulaInfractor]);

    // Maneja el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifica si la placa existe
        const placaExists = await checkAndAddPlaca(placasId);
        if (!placaExists) {
            console.log('Error: La placa no existe o no se pudo agregar');
            return;
        }

        // Verifica si el usuario ya existe
        const userIdInfractor = await checkUserExists(cedulaInfractor);

        const multaData = {
            nombreInfractor,
            apellidoInfractor,
            cedulaInfractor,
            longitud: parseFloat(longitud),
            latitud: parseFloat(latitud),
            fecha,
            pagada: false,
            resuelta: false,
            fotoSinpe: "string",
            total: selectedInfracciones.reduce((accumulator, id) => {
                const infra = infraccion.find(item => item.id == id);
                return accumulator + (infra ? infra.costo : 0);
            }, 0),
            idOficial: userId,
            idInfractor: userIdInfractor ? userIdInfractor.id : null,
            infraccionMultas: selectedInfracciones.map(id => ({ catalogoInfraccionesId: id })),
            multaPlacas: [{
                placasId,
            }]
        };

        console.log(multaData);

        try {
            const response = await fetch('https://localhost:7201/api/Multas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(multaData)
            });

            if (response.ok) {
                console.log(userIdInfractor);

                if (userIdInfractor && userIdInfractor.id) {
                    const notificationUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            titulo: 'Nueva Multa',
                            descripcion: 'Se ha registrado una nueva multa a su nombre.',
                            fecha: new Date().toISOString(),
                            leido: false,
                            idUsuario: userIdInfractor.id
                        })
                    });

                    if (!notificationUsuarioFinal.ok) {
                        console.error('Error al enviar notificación al usuario final');
                    } 
                }

               // alert('Multa creada exitosamente');
                toast.success('Multa creada exitosamente');
                // Resetea los campos
                setNombreInfractor('');
                setApellidoInfractor('');
                setCedulaInfractor('');
                setLongitud('');
                setLatitud('');
                setFecha('');
                setIdPlaca('');
                setSelectedInfracciones([]); // Reset selected infracciones
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

        // Componente para manejar eventos en el mapa (clic para seleccionar ubicación)
        function LocationMarker() {
            useMapEvents({
                click(e) {
                    setLatitud(e.latlng.lat);
                    setLongitud(e.latlng.lng);
                    setSelectedPosition([e.latlng.lat, e.latlng.lng]);
                },
            });
            return selectedPosition ? (
                <Marker position={selectedPosition} icon={markerIcon}></Marker>
            ) : null;
        }

    return (
        <div className="crear-multa-background">
            <HeaderOficial />
            <div className="shape-background"></div>
            <div className="crear-multa-container">
                <h2>Crear Multa</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-login input-icon">
                        <FaMapMarkerAlt className="icon" />
                        <input
                            type="text"
                            placeholder="Buscar ubicación por nombre"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button type="button" onClick={searchLocation} className="search-button">Buscar</button>
                    </div>
                    <div className="form-group">
                        <FaIdCard className="icon" />
                        <input
                            type="text"
                            placeholder="Numero de Placa"
                            value={placasId}
                            onChange={(e) => setIdPlaca(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="Cédula del Infractor"
                            value={cedulaInfractor}
                            onChange={(e) => setCedulaInfractor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="Nombre del Infractor"
                            value={nombreInfractor}
                            onChange={(e) => setNombreInfractor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FaUser className="icon" />
                        <input
                            type="text"
                            placeholder="Apellido del Infractor"
                            value={apellidoInfractor}
                            onChange={(e) => setApellidoInfractor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <FaCalendarAlt className="icon" />
                        <input
                            type="date"
                            placeholder="Fecha de la Infracción"
                            value={fecha}
                            onChange={(e) => setFecha(e.target.value)}
                            required
                        />
                    </div>
                    <label>Selecciona la Ubicación:</label>
                    <MapContainer center={selectedPosition} zoom={13} className="leaflet-container">
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <LocationMarker />
                    </MapContainer>
                    <div className="form-group form-container">
                        <label>Tipo de Infracción:</label>
                        <div className="checkbox-container">
                            {infraccion.map((infraccion) => (
                                <div key={infraccion.id} className="form-check">
                                <input
                                    type="checkbox"
                                    id={`infraccion-${infraccion.id}`}
                                    value={infraccion.id}
                                    onChange={(e) => {
                                    const value = e.target.value;
                                    if (e.target.checked) {
                                        setSelectedInfracciones([...selectedInfracciones, value]);
                                    } else {
                                        setSelectedInfracciones(
                                        selectedInfracciones.filter((id) => id !== value)
                                        );
                                    }
                                    }}
                                    className="form-check-input"
                                />
                                <label
                                    htmlFor={`infraccion-${infraccion.id}`}
                                    className="form-check-label"
                                >
                                    {infraccion.nombre}
                            </label>
                        </div>
                        ))}
                    </div>
</div>
                    <button type="submit" className="btn-submit">Registrar Multa</button>
                    {message && <p className="message">{message}</p>}
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CrearMulta;
