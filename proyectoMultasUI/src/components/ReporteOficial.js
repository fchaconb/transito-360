import React, { useEffect, useState, useRef } from "react";
import { Chart } from "chart.js/auto";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

function ReporteOficial() {
  const [multas, setMultas] = useState([]);
  const [multasFiltradas, setMultasFiltradas] = useState([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [userEmail, setUserEmail] = useState("correo@predeterminado.com"); // Correo predeterminado
  const userId = localStorage.getItem("userId");
  const chartRef = useRef(null);

  useEffect(() => {
    // Llamadas al backend para obtener multas y correo del oficial
    const fetchDatos = async () => {
      try {
        // Obtener multas del oficial
        const responseMultas = await fetch(
          `https://localhost:7201/api/Multas/IdOficial/${userId}`
        );
        if (!responseMultas.ok) {
          throw new Error("Error al obtener las multas del oficial");
        }
        const dataMultas = await responseMultas.json();
        setMultas(dataMultas);
        setMultasFiltradas(dataMultas);

        // Obtener correo del oficial
        const responseUsuario = await fetch(
          `https://localhost:7201/api/Usuarios/${userId}`
        );
        if (!responseUsuario.ok) {
          throw new Error("Error al obtener el correo del oficial");
        }
        const dataUsuario = await responseUsuario.json();
        setUserEmail(dataUsuario.correo);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchDatos();
  }, [userId]);

  // Filtrar multas por rango de fechas
  const filtrarMultasPorFecha = () => {
    const desdeFecha = fechaDesde ? new Date(fechaDesde) : null;
    const hastaFecha = fechaHasta ? new Date(fechaHasta) : null;

    const filtradas = multas.filter((multa) => {
      const fechaMulta = new Date(multa.fecha);
      return (
        (!desdeFecha || fechaMulta >= desdeFecha) &&
        (!hastaFecha || fechaMulta <= hastaFecha)
      );
    });

    setMultasFiltradas(filtradas);
  };

  // Renderizar gráfico
  const renderChart = () => {
    const ctx = document.getElementById("chartOficial").getContext("2d");

    if (chartRef.current) {
      chartRef.current.destroy(); // Destruir gráfico anterior
    }

    const multasCreadas = multasFiltradas.length;
    const declaracionesEnviadas = multasFiltradas.filter(
      (multa) => multa.disputa
    ).length;

    const maxValor = Math.max(multasCreadas, declaracionesEnviadas);
    const rangoMaximo = Math.ceil((maxValor + 1) / 10) * 10;

    chartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Multas Creadas", "Declaraciones Enviadas"],
        datasets: [
          {
            label: "Totales",
            data: [multasCreadas, declaracionesEnviadas],
            backgroundColor: ["#88A0A8", "#B4CEB3"],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            max: rangoMaximo,
            ticks: {
              stepSize: 10,
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    renderChart();
  }, [multasFiltradas]);

  // Exportar a Excel
  const exportarExcel = () => {
    const filas = multasFiltradas.map((multa) => ({
      Fecha: new Date(multa.fecha).toLocaleDateString("es-ES"),
      Zona: multa.zona || "N/A",
      Monto: `₡${(multa.total ?? 0).toLocaleString("es-ES", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      Estado: multa.pagada ? "Pagada" : "No Pagada",
    }));

    const encabezados = [["Fecha", "Monto", "Estado"]];
    const hoja = XLSX.utils.json_to_sheet(filas, { header: encabezados });
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Multas");
    XLSX.writeFile(libro, "reporte_multas_oficial.xlsx");
  };

  // Exportar a PDF
  const exportarPDF = () => {
    const doc = new jsPDF();
    const logoUrl = `${process.env.PUBLIC_URL}/logo.png.jpeg`;

    const logoImage = new Image();
    logoImage.src = logoUrl;

    logoImage.onload = () => {
      doc.addImage(logoImage, "JPEG", 10, 10, 30, 30);
      doc.text("Reporte de Multas - Oficial", 50, 20);
      doc.text(`Correo del Oficial: ${userEmail}`, 50, 30); // Correo en el PDF

      const filas = multasFiltradas.map((multa) => [
        new Date(multa.fecha).toLocaleDateString("es-ES"),
        multa.zona || "N/A",
        `₡${(multa.total ?? 0).toLocaleString("es-ES", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        multa.pagada ? "Pagada" : "No Pagada", // "Estado" como última columna
      ]);

      autoTable(doc, {
        head: [["Fecha", "Monto", "Estado"]], // Cambiar orden aquí
        body: filas,
        startY: 40,
        headStyles: { fillColor: "#007BFF" },
      });

      doc.save("reporte_multas_oficial.pdf");
    };
  };

  return (
    <div className="reporte-container">
      <h3>Informe de Multas y Declaraciones - Oficial</h3>
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
        <button onClick={filtrarMultasPorFecha} className="btn-filter">
          Filtrar
        </button>
      </div>
      <canvas id="chartOficial"></canvas>
      <div className="btn-group">
        <button onClick={exportarExcel} className="btn-export">
          Exportar a Excel
        </button>
        <button onClick={exportarPDF} className="btn-export">
          Exportar a PDF
        </button>
      </div>
    </div>
  );
}

export default ReporteOficial;
