import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NextCodeSolutions.css'; // Asegúrate de crear este archivo CSS
import JoseMarioPhoto from './imagen/JoseMario.jpg'; 
import FabianPhoto from './imagen/Fabian.jpg';
import CarolinaPhoto from './imagen/Carolina.jpg';
import GeraldPhoto from './imagen/GeraldFoto.jpeg';

const NextCodeSolutions = () => {
    const navigate = useNavigate();

    const handleLogin = () => navigate('/login');
    const handleRegister = () => navigate('/register');

    const teamMembers = [
        { name: 'Gerald Delgado', role: 'Líder de Desarrollo', photo:GeraldPhoto }, // Cambia esto por la ruta correcta de la foto
        { name: 'Jose Mario', role: 'Líder de QA', photo: JoseMarioPhoto }, 
        { name: 'Carolina Gutierrez', role: 'Product Owner', photo: CarolinaPhoto }, 
        { name: 'Fabian Chacon', role: 'Scrum Master', photo: FabianPhoto },  
    ];

    return (
        <div className="container">
            <header className="header">
                <div className="header-left">
                    <button className="nav-button" onClick={() => navigate('/')}>Tránsito 360</button>
                    <button className="nav-button" onClick={() => window.location.reload()}>NextCodeSolutions</button>
                </div>
                <div className="header-right">
                    <button onClick={handleLogin}>Iniciar Sesión</button>
                    <button onClick={handleRegister}>Registrarse</button>
                </div>
            </header>

            <h1 className="transito-title">Next Code Solutions</h1>
            <h2 className="slogan">Innovamos el futuro, resolvemos el presente.</h2>

            <section className="team">
                {teamMembers.map((member, index) => (
                    <div key={index} className="card">
                        <img src={member.photo} alt={member.name} className="profile-photo" />
                        <h3>{member.name}</h3>
                        <p>{member.role}</p>
                    </div>
                ))}
            </section>

            <section className="values">
                <h2 className='values-title'>Valores</h2>
                <ul>
                    <li>Tolerancia y diversidad: Valoramos y respetamos la diversidad de nuestros colaboradores, clientes y usuarios.</li>
                    <li>Calidad: Nos comprometemos a entregar productos de la máxima calidad, garantizando la satisfacción del cliente.</li>
                    <li>Innovación: Fomentamos la creatividad y el pensamiento fuera de lo convencional para ofrecer soluciones innovadoras y efectivas.</li>
                    <li>Enfoque en el usuario: Nos esforzamos por comprender las necesidades y deseos de nuestros usuarios y ofrecer soluciones que satisfagan sus expectativas.</li>
                </ul>
            </section>
            <footer>
                <h2 className="footer-title">Next Code Solutions</h2>
            </footer>
        </div>
    );
};

export default NextCodeSolutions;
