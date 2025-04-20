import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Importa los estilos de react-toastify
import React, { useState } from 'react';
import './Pago.css';
import { useNavigate, useLocation } from 'react-router-dom';
import HeaderUsuario from './HeaderUsuario';  
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import UploadWidget from './UploadWidget';

function Pago() {
    const location = useLocation();
    const multa = location.state?.multa || {};
    const [metodoPago, setMetodoPago] = useState('');
    const [fotoSinpe, setFotoSinpe] = useState(null);
    const [error, setError] = useState('');
    const [mensajeExito, setMensajeExito] = useState('');
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const handleMetodoChange = (event) => {
        setMetodoPago(event.target.value);
        setFotoSinpe(null);  // Reiniciar comprobante si cambia el método de pago
        setError('');
        setMensajeExito('');
    };

    const handleComprobanteChange = (event) => {
        setFotoSinpe(event.target.files[0]);
        setError('');
    };

    const notificacionCambioDeEstado = async (idUsuario) => {
        const notificacionUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                titulo: `Cambio de estado de multa.`,
                descripcion: `La multa ${multa.id} ha cambiado de estado.`,
                fecha: new Date().toISOString(),
                leido: false,
                idUsuario: idUsuario
            }),
        });

        if (notificacionUsuarioFinal.ok) {
            console.log('Notificación creada exitosamente.');
        } else {
            console.error('Error al crear la notificación.');
        }
    }

    const handlePago = async () => {
        // Validación para el pago por SINPE
        if (metodoPago === 'sinpe' && !fotoSinpe) {
            toast.error('Por favor, suba el comprobante de transferencia.');
            return;
        }
        
        // Reiniciar mensajes de error y éxito antes de procesar el pago
        setError('');
        setMensajeExito('');

        // Simulación de la lógica para procesar el pago
        if (metodoPago === 'paypal') {
            try {
                const multaData = {
                    ...multa,
                    pagada: true,
                    resuelta: true
                };

                const updateMultaResponse = await fetch(`https://localhost:7201/api/Multas/${multa.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(multaData),
                });

                if (updateMultaResponse.ok) {
                    toast.success('Pago procesado exitosamente con PayPal.');
                    generarFactura();

                    // Check for related disputa
                    const disputaResponse = await fetch(`https://localhost:7201/api/Disputas/IdMulta/${multa.id}`);
                    if (disputaResponse.ok) {
                        const disputas = await disputaResponse.json();
                        if (disputas && disputas.length > 0) {
                            for (const disputa of disputas) {
                                const disputaData = {
                                    ...disputa,
                                    estado: 'Resuelta',
                                    resolucion: 'Usuario pagó la multa.',
                                };

                                const updateDisputaResponse = await fetch(`https://localhost:7201/api/Disputas/${disputa.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(disputaData),
                                });

                                if (!updateDisputaResponse.ok) {
                                    toast.error('Error al actualizar la disputa.');
                                } else {
                                    notificacionCambioDeEstado(disputa.idUsuarioFinal);
                                    notificacionCambioDeEstado(disputa.idOficial);
                                    notificacionCambioDeEstado(disputa.idJuez);
                                }
                            }
                        }
                    }

                    const notificacionUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            titulo: `Pago de multa exitoso.`,
                            descripcion: `Se ha procesado el pago de la multa ${multa.id} exitosamente.`,
                            fecha: new Date().toISOString(),
                            leido: false,
                            idUsuario: userId
                        }),
                    });

                    if (notificacionUsuarioFinal.ok) {
                        console.log('Notificación creada exitosamente.');
                    } else {
                        console.error('Error al crear la notificación.');
                    }

                    navigate('/ver-multas');
                } else {
                    toast.error('Error al actualizar la multa.');
                }
            }
            catch (error) {
                toast.error('Error al procesar el pago con PayPal.');
            }
            
        } else if (metodoPago === 'sinpe') {
            try {
                const multaData = {
                    ...multa,
                    fotoSinpe,
                    pagada: true,
                    resuelta: true
                };

                const updateMultaResponse = await fetch(`https://localhost:7201/api/Multas/${multa.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(multaData),
                });

                if (updateMultaResponse.ok) {
                    toast.success('Pago enviado exitosamente con SINPE.');
                    generarFactura();

                    // Check for related disputa
                    const disputaResponse = await fetch(`https://localhost:7201/api/Disputas/IdMulta/${multa.id}`);
                    if (disputaResponse.ok) {
                        const disputas = await disputaResponse.json();
                        if (disputas && disputas.length > 0) {
                            for (const disputa of disputas) {
                                const disputaData = {
                                    ...disputa,
                                    estado: 'Resuelta',
                                    resolucion: 'Usuario pagó la multa.',
                                };

                                const updateDisputaResponse = await fetch(`https://localhost:7201/api/Disputas/${disputa.id}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(disputaData),
                                });

                                if (!updateDisputaResponse.ok) {
                                    toast.error('Error al actualizar la disputa.');
                                } else {
                                    notificacionCambioDeEstado(disputa.idUsuarioFinal);
                                    notificacionCambioDeEstado(disputa.idOficial);
                                    notificacionCambioDeEstado(disputa.idJuez);
                                }
                            }
                        }
                    }

                    const notificacionUsuarioFinal = await fetch('https://localhost:7201/api/Notificaciones', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            titulo: `Pago de multa exitoso.`,
                            descripcion: `Se ha procesado el pago de la multa ${multa.id} exitosamente.`,
                            fecha: new Date().toISOString(),
                            leido: false,
                            idUsuario: userId
                        }),
                    });

                    if (notificacionUsuarioFinal.ok) {
                        console.log('Notificación creada exitosamente.');
                    }
                    else {
                        console.error('Error al crear la notificación.');
                    }
                    navigate('/ver-multas');
                } else {
                    toast.error('Error al actualizar la multa.');
                }
            } catch (error) {
                toast.error('Error al procesar el pago con SINPE.');
            }
        } else {
            toast.error('Seleccione un método de pago para continuar.');
        }
    };

    const generarFactura = () => {
        const subTotal = multa.total - (0.13 * multa.total);

        try{
            const facturaData = {
                fechaPago: new Date(),
                detalle: `Pago de multa por ${multa.id}`,
                subTotal: subTotal,
                total: multa.total,
                metodoPago: metodoPago,
                idUsuario: userId,
                idMulta: multa.id
            };

            fetch('https://localhost:7201/api/Facturas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(facturaData),
            });

            toast.success('Factura generada exitosamente.');

        } catch (error) {
            toast.error('Error al generar la factura.');
        }
    };

    const EXCHANGE_RATE_CRC_TO_USD = 0.0020;
    const totalInUSD = (multa.total * EXCHANGE_RATE_CRC_TO_USD).toFixed(2); // Convierte CRC a USD

    return (
        <div className="pago-page">
            <HeaderUsuario />  {/* Incluir el HeaderUsuario aquí */}
            <div className="pago-container">
                <h2>Seleccione su método de pago</h2>
                <div className="metodo-pago">
                    <label>
                        <input type="radio" value="sinpe" checked={metodoPago === 'sinpe'} onChange={handleMetodoChange} />
                        SINPE
                    </label>
                    <label>
                        <input type="radio" value="paypal" checked={metodoPago === 'paypal'} onChange={handleMetodoChange} />
                        PayPal
                    </label>
                </div>

                {metodoPago === 'sinpe' && (
                    <div>
                        <div className="sinpe-instrucciones">
                            <p>Nombre: Tránsito 360</p>
                            <p>Cédula Jurídica: 3-101-769456</p>
                            <p>Cuenta IBAN Banco Nacional: CR050907801032104104010</p>
                            <p>Cuenta IBAN BAC San Jose: CR050907801032104104020</p>
                            <p>Monto por Pagar: {`₡${(multa.total ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</p>
                            <br />
                            <p>Por favor, realice una transferencia a cualquiera de las cuentas bancarias indicadas.</p>
                            <p>Suba el comprobante de transferencia para confirmar el pago.</p>
                        </div>
                        <div className="comprobante-upload">
                            <UploadWidget onUpload={setFotoSinpe} />
                            <button onClick={handlePago} className="enviar-button">Pagar</button>
                        </div>
                    </div>
                )}

                {metodoPago === 'paypal' && (
                    <div className="paypal-button">
                        <PayPalButtons
                            style={{ layout: 'vertical' }}
                            createOrder={(data, actions) => {
                                return actions.order.create({
                                    purchase_units: [
                                        {
                                            amount: {
                                                currency_code: 'USD', // Cambia a una moneda soportada como USD
                                                value: totalInUSD,
                
                                            },
                                        },
                                    ],
                                });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order.capture().then((details) => {
                                    toast.success(`Pago procesado exitosamente por ${details.payer.name.given_name}`);
                                    handlePago();
                                });
                            }}
                            onError={(err) => {
                                toast.error('Error al procesar el pago con PayPal.');
                            }}
                        />
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default Pago;
