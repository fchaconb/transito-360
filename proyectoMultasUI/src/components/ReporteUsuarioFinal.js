import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

function ReporteUsuarioFinal() {
    const [multas, setMultas] = useState([]);
    const [multasFiltradas, setMultasFiltradas] = useState([]);
    const [userEmail, setUserEmail] = useState("correo@predeterminado.com"); // Correo predeterminado
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const chartRef = useRef(null);
    const userId = localStorage.getItem('userId'); // Obtener el ID del usuario desde el localStorage

    useEffect(() => {
        // Llamada al backend para obtener datos del usuario y las multas
        const fetchDatos = async () => {
            try {
                // Obtener el correo del usuario
                const responseUsuario = await fetch(`https://localhost:7201/api/Usuarios/${userId}`);
                if (!responseUsuario.ok) throw new Error("Error al obtener el correo del usuario.");
                const dataUsuario = await responseUsuario.json();
                setUserEmail(dataUsuario.correo);

                // Obtener las multas del usuario
                const responseMultas = await fetch(`https://localhost:7201/api/Multas/IdInfractor/${userId}`);
                if (!responseMultas.ok) throw new Error("Error al cargar las multas.");
                const dataMultas = await responseMultas.json();
                setMultas(dataMultas);
                setMultasFiltradas(dataMultas);
            } catch (error) {
                console.error("Error al cargar datos:", error);
            }
        };

        fetchDatos();
    }, [userId]);

    // Aplicar filtros por rango de fechas
    const filtrarMultas = () => {
        let filtradas = [...multas];

        if (fechaDesde) {
            filtradas = filtradas.filter(multa => new Date(multa.fecha) >= new Date(fechaDesde));
        }

        if (fechaHasta) {
            filtradas = filtradas.filter(multa => new Date(multa.fecha) <= new Date(fechaHasta));
        }

        setMultasFiltradas(filtradas);
    };

    // Calcular estadísticas
    const multasPagadas = multasFiltradas.filter(multa => multa.pagada).length;
    const multasPorCancelar = multasFiltradas.filter(multa => !multa.pagada).length;

    // Renderizar gráfico
    useEffect(() => {
        const ctx = document.getElementById("chartUsuarioFinal").getContext("2d");

        // Destruir gráfico anterior si existe
        if (chartRef.current) chartRef.current.destroy();

        // Crear nuevo gráfico
        chartRef.current = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Multas Pagadas", "Multas por Cancelar"],
                datasets: [
                    {
                        label: "Cantidad de Multas",
                        data: [multasPagadas, multasPorCancelar],
                        backgroundColor: ["#88A0A8", "#B4CEB3"],
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 10, // Incremento en el eje Y
                        },
                    },
                },
                plugins: {
                    legend: { display: false },
                    title: {
                        display: true,
                        text: "Informe de Multas - Usuario Final",
                    },
                },
            },
        });
    }, [multasFiltradas, multasPagadas, multasPorCancelar]);

    // Exportar a Excel
    const exportarExcel = () => {
        const filas = multasFiltradas.map(multa => ({
            Fecha: new Date(multa.fecha).toLocaleDateString("es-ES"),
            Monto: `₡${multa.total.toLocaleString("es-ES", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}`,
            Infracciones: multa.infracciones // Asumiendo que `infracciones` es un array de objetos con propiedad `nombre`
                ? multa.infracciones.map(inf => inf.nombre).join(", ")
                : "N/A",
            Estado: multa.pagada ? "Pagada" : "Por Cancelar", // Estado al final
        }));

        const encabezados = "Fecha;Monto;Infracciones;Estado";
        const contenido = filas
            .map(fila => `${fila.Fecha};${fila.Monto};${fila.Infracciones};${fila.Estado}`)
            .join("\n");

        const csvContent = `data:text/csv;charset=utf-8,\ufeff${encabezados}\n${contenido}`;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "reporte_usuario_final.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Exportar a PDF
    const exportarPDF = () => {
        const doc = new jsPDF();
        const logoUrl = `${process.env.PUBLIC_URL}/logo.png.jpeg`;

        const logoImage = new Image();
        logoImage.src = logoUrl;

        logoImage.onload = () => {
            doc.addImage(logoImage, "JPEG", 10, 10, 30, 30);
            doc.text("Informe de Multas - Usuario Final", 50, 20);
            doc.text(`Generado por: ${userEmail}`, 50, 30); // Mostrar correo en el PDF únicamente

            autoTable(doc, {
                startY: 40,
                head: [["Fecha", "Monto", "Infracciones", "Estado"]], // Estado al final
                body: multasFiltradas.map(multa => [
                    new Date(multa.fecha).toLocaleDateString("es-ES"),
                    `₡${multa.total.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    multa.infracciones
                        ? multa.infracciones.map(inf => inf.nombre).join(", ")
                        : "N/A",
                    multa.pagada ? "Pagada" : "Por Cancelar",
                ]),
                headStyles: { fillColor: "#007BFF" },
            });

            doc.save("reporte_usuario_final.pdf");
        };
    };

    return (
        <div className="reporte-container">
            <h3>Informe de Multas - Usuario Final</h3>
            <div className="filter-container">
                <div>
                    <label htmlFor="fechaDesde">Desde:</label>
                    <input
                        type="date"
                        id="fechaDesde"
                        value={fechaDesde}
                        onChange={(e) => setFechaDesde(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fechaHasta">Hasta:</label>
                    <input
                        type="date"
                        id="fechaHasta"
                        value={fechaHasta}
                        onChange={(e) => setFechaHasta(e.target.value)}
                    />
                </div>
                <button className="btn-filter" onClick={filtrarMultas}>
                    Filtrar
                </button>
            </div>

            <canvas id="chartUsuarioFinal"></canvas>

            <div className="btn-group">
                <button className="btn-export" onClick={exportarExcel}>
                    Exportar a Excel
                </button>
                <button className="btn-export" onClick={exportarPDF}>
                    Exportar a PDF
                </button>
            </div>
        </div>
    );
}

export default ReporteUsuarioFinal;
