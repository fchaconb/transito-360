import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import HeatMap from './HeatMap';
import ReCAPTCHA from 'react-google-recaptcha';
import './HomePage.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Importa los estilos de react-toastify

function HomePage() {
    const navigate = useNavigate();
    const [plate, setPlate] = useState(''); 
    const [results, setResults] = useState([]);
    const [heatmapPoints, setHeatmapPoints] = useState([]);
    const [infracciones, setInfracciones] = useState([]);
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    useEffect(() => {
        const fetchHeatmapPoints = async () => {
            try {
                const response = await fetch('https://localhost:7201/api/Multas');
                const data = await response.json();
                setHeatmapPoints(data.map(multa => [multa.latitud, multa.longitud]));
            } catch (error) {
                console.error('Error fetching heatmap points:', error);
            }
        };

        const fetchInfracciones = async () => {
            try {
                const response = await fetch('https://localhost:7201/api/CatalogoInfracciones');
                const data = await response.json();
                setInfracciones(data);
            } catch (error) {
                console.error('Error fetching infracciones:', error);
            }
        };

        fetchHeatmapPoints();
        fetchInfracciones();
    }, []);

    const blueIcon = new L.Icon({
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        shadowSize: [41, 41]
    });

    const handleLogin = () => navigate('/login');
    const handleRegister = () => navigate('/register');

    const handleSearch = async () => {
        if (!recaptchaToken) {
            toast.error('Por favor complete el reCAPTCHA para continuar con la búsqueda.');
            return;
        }

        try {
            const response = await fetch(`https://localhost:7201/api/Multas/PlacaID/${plate}`);
            const data = await response.json();

            const mappedResults = data.map(result => ({
                ...result,
                infracciones: result.infraccionMultas.map(infraccion => {
                    const infraccionDetail = infracciones.find(i => i.id === infraccion.catalogoInfraccionesId);
                    return infraccionDetail ? infraccionDetail.nombre : infraccion.catalogoInfraccionesId;
                }).join(', '),
                placa: result.multaPlacas.map(placa => placa.placasId).join(', ')
            }));

            setResults(mappedResults);
        } catch (error) {
            console.error('Error fetching search results:', error);
        }
    };

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    return (
        <body className="container mt-5">
            <header className="header">
                <div className="header-left">
                    <button className="nav-button" onClick={() => window.location.reload()}>Tránsito 360</button>
                    <button className="nav-button" onClick={() => navigate('/NextCodeSolutions')}>NextCodeSolutions</button>
                </div>
                <div className="header-right">
                    <button onClick={handleLogin}>Iniciar Sesión</button>
                    <button onClick={handleRegister}>Registrarse</button>
                </div>
            </header>

            <div className="transito-container">
                <h1 className="transito-title">Tránsito 360</h1>
            </div>

            <h2></h2>
            <div className="mapa-calor-container">
                <h3 className="mapa-calor-title">Mapa de Calor de Multas</h3>
            </div>

            <div className="heatmap-section">
                <MapContainer center={[9.934819, -84.088046]} zoom={5} className="map-container">
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <HeatMap points={heatmapPoints} />
                    {heatmapPoints.map((point, index) => (
                        <Marker key={index} position={point} icon={blueIcon} />
                    ))}
                </MapContainer>
            </div>

            <div className="section-container">
                <h3 className="consulta-placa-title">Consulta por Placa</h3>
                <div className="consulta-form">
                    <input
                        type="text"
                        placeholder="Ingresa el número de placa"
                        value={plate}
                        onChange={(e) => setPlate(e.target.value)}
                    />
                    
                    <button onClick={handleSearch}>Buscar</button>
                </div>
                <div className="consulta-form">
                <ReCAPTCHA
                        sitekey="6Lf0Ko0qAAAAACNgXe2jDdlHC1-cNFhn_QQU3KZJ"
                        onChange={handleRecaptchaChange}
                    />
                </div>
                <table className="results-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellido</th>
                            <th>Cédula</th>
                            <th>Placa</th>
                            <th>Infracciones</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result, index) => (
                            <tr key={index}>
                                <td>{result.nombreInfractor}</td>
                                <td>{result.apellidoInfractor}</td>
                                <td>{result.cedulaInfractor}</td>
                                <td>{result.placa}</td>
                                <td>{result.infracciones}</td>
                                <td>{result.fecha ? new Date(result.fecha).toLocaleDateString() : ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <ToastContainer />
            </div>
            <footer>  <h2 className="footer-title">Next Code Solutions</h2></footer>
        </body>
    );
}

export default HomePage;