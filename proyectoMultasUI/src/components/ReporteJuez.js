import React, { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

function ReporteJuez() {
  const [disputas, setDisputas] = useState([]);
  const [disputasFiltradas, setDisputasFiltradas] = useState([]);
  const [chart, setChart] = useState(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [userEmail, setUserEmail] = useState("correo@predeterminado.com"); // Correo predeterminado
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Llamada al backend para obtener el correo del usuario
    const fetchUserEmail = async () => {
      try {
        const response = await fetch(`https://localhost:7201/api/Usuarios/${userId}`);
        if (!response.ok) {
          throw new Error("No se pudo cargar el perfil del usuario.");
        }
        const data = await response.json();
        setUserEmail(data.correo);
      } catch (error) {
        console.error("Error al obtener el correo del usuario:", error);
      }
    };

    // Llamada al backend para obtener las disputas
    const fetchDisputas = async () => {
      try {
        const response = await fetch(`https://localhost:7201/api/Disputas/IdJuez/${userId}`);
        const data = await response.json();
        setDisputas(data);
        setDisputasFiltradas(data);
      } catch (error) {
        console.error("Error al obtener las disputas:", error);
      }
    };

    fetchUserEmail();
    fetchDisputas();
  }, [userId]);

  // Aplicar filtros por fecha
  const filtrarDisputas = () => {
    let filtrado = [...disputas];

    if (fechaDesde) {
      filtrado = filtrado.filter(
        (disputa) => new Date(disputa.fecha) >= new Date(fechaDesde)
      );
    }

    if (fechaHasta) {
      filtrado = filtrado.filter(
        (disputa) => new Date(disputa.fecha) <= new Date(fechaHasta)
      );
    }

    setDisputasFiltradas(filtrado);
  };

  // Calcular estadísticas
  const pendientes =
    disputasFiltradas.filter((disputa) => disputa.resolucion === "Pendiente").length;
  const aprobadas =
    disputasFiltradas.filter((disputa) => disputa.resolucion === "Anulación de Multa").length;
  const denegadas =
    disputasFiltradas.filter((disputa) => disputa.resolucion === "Multa Validada" || disputa.resolucion === "Usuario pagó la multa.").length;

  // Gráfico dinámico
  useEffect(() => {
    if (chart) {
      chart.destroy(); // Destruir gráfico anterior
    }

    const ctx = document.getElementById("chartJuez").getContext("2d");

    const maxValor = Math.max(pendientes, aprobadas, denegadas);
    const rangoMaximo = Math.ceil((maxValor + 1) / 10) * 5;

    const nuevoChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Disputas Pendientes", "Disputas Aprobadas", "Disputas Denegadas"],
        datasets: [
          {
            label: "Cantidad de Disputas",
            data: [pendientes, aprobadas, denegadas],
            backgroundColor: ["#F5A623", "#7ED321", "#D0021B"],
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

    setChart(nuevoChart);

    return () => {
      if (nuevoChart) {
        nuevoChart.destroy();
      }
    };
  }, [disputasFiltradas, pendientes, aprobadas, denegadas]);

  // Exportar a Excel
  const exportarExcel = () => {
    const filas = disputasFiltradas.map((disputa) => ({
      Fecha: new Date(disputa.fecha).toLocaleDateString("es-ES"),
      Razón: disputa.razon || "N/A",
      Descripción: disputa.descripcion || "N/A",
      Estado: disputa.estado,
      Resolución: disputa.resolucion,
    }));

    const encabezados = "Fecha;Razón;Descripción;Estado;Resolución";
    const contenido = filas
      .map(
        (fila) =>
          `${fila.Fecha};${fila.Razón};${fila.Descripción};${fila.Estado};${fila.Resolución}`
      )
      .join("\n");

    const csvContent = `data:text/csv;charset=utf-8,\ufeff${encabezados}\n${contenido}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_disputas_juez.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportar a PDF
  const exportarPDF = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();
        const logoUrl = `${process.env.PUBLIC_URL}/logo.png.jpeg`;

        const logoImage = new Image();
        logoImage.src = logoUrl;
        logoImage.onload = () => {
          doc.addImage(logoImage, "JPEG", 10, 10, 30, 30);
          doc.text("Reporte de Disputas - Juez", 50, 20);
          doc.text(`Generado por: ${userEmail}`, 50, 30);

          const filas = disputasFiltradas.map((disputa) => [
            new Date(disputa.fecha).toLocaleDateString("es-ES"),
            disputa.razon || "N/A",
            disputa.descripcion || "N/A",
            disputa.estado,
            disputa.resolucion,
          ]);

          doc.autoTable({
            head: [["Fecha", "Razón", "Descripción", "Estado", "Resolución"]],
            body: filas,
            startY: 40,
            headStyles: { fillColor: "#007BFF" },
          });

          doc.save("reporte_disputas_juez.pdf");
        };
      });
    });
  };

  return (
    <div className="reporte-container">
      <h3>Informe de Disputas - Juez</h3>

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
        <button className="btn-filter" onClick={filtrarDisputas}>
          Filtrar
        </button>
      </div>

      <canvas id="chartJuez"></canvas>

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

export default ReporteJuez;
