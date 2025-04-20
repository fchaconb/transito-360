import React, { useState } from 'react';

function MultasPorCamaras() {
    const [matriculaDetectada, setMatriculaDetectada] = useState('');
    const [tipoInfraccion, setTipoInfraccion] = useState('Exceso de Velocidad');

    const manejarMultaAutomatica = () => {
        const nuevaMulta = {
            matricula: matriculaDetectada,
            tipoInfraccion,
            fecha: new Date().toLocaleDateString(),
            monto: 100 // Monto estándar para la infracción
        };

        // Simular el envío de la multa a una base de datos o backend
        console.log("Multa automática creada:", nuevaMulta);
        setMatriculaDetectada('');
    };

    return (
        <div className="container mt-5">
            <h2>Multas Automáticas por Cámaras</h2>
            <div className="form-group">
                <label>Matrícula Detectada</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={matriculaDetectada}
                    onChange={(e) => setMatriculaDetectada(e.target.value)} 
                    placeholder="Matrícula detectada por cámara"
                />
            </div>
            <div className="form-group">
                <label>Tipo de Infracción</label>
                <select 
                    className="form-control" 
                    value={tipoInfraccion}
                    onChange={(e) => setTipoInfraccion(e.target.value)}
                >
                    <option value="Exceso de Velocidad">Exceso de Velocidad</option>
                    <option value="Pasar semáforo en rojo">Pasar semáforo en rojo</option>
                    <option value="Estacionamiento prohibido">Estacionamiento prohibido</option>
                </select>
            </div>
            <button className="btn btn-primary mt-3" onClick={manejarMultaAutomatica}>Registrar Multa Automática</button>
        </div>
    );
}

export default MultasPorCamaras;
