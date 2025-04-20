import React, { useEffect, useState } from "react";
import { Chart } from "chart.js/auto";

function ReporteAdministrativo() {
  const [multas, setMultas] = useState([]);
  const [multasFiltradas, setMultasFiltradas] = useState([]);
  const [chart, setChart] = useState(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [cedulaFiltro, setCedulaFiltro] = useState("");
  const [userEmail, setUserEmail] = useState("correo@predeterminado.com"); // Correo predeterminado
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    // Llamada para obtener el correo del usuario desde el backend
    const fetchUserEmail = async () => {
      try {
        const response = await fetch(`https://localhost:7201/api/Usuarios/${userId}`);
        if (!response.ok) {
          throw new Error("No se pudo cargar el perfil del usuario.");
        }
        const data = await response.json();
        setUserEmail(data.correo); // Usar correo desde el backend
      } catch (error) {
        console.error("Error al obtener el correo del usuario:", error);
      }
    };

    // Llamada para obtener las multas desde el backend
    const fetchMultas = async () => {
      try {
        const response = await fetch("https://localhost:7201/api/Multas");
        const data = await response.json();
        setMultas(data);
        setMultasFiltradas(data);
      } catch (error) {
        console.error("Error al obtener las multas:", error);
      }
    };

    fetchUserEmail();
    fetchMultas();
  }, []);

  // Aplicar filtros a las multas
  const filtrarMultas = () => {
    let filtrado = [...multas];

    if (fechaDesde) {
      filtrado = filtrado.filter(
        (multa) => new Date(multa.fecha) >= new Date(fechaDesde)
      );
    }

    if (fechaHasta) {
      filtrado = filtrado.filter(
        (multa) => new Date(multa.fecha) <= new Date(fechaHasta)
      );
    }

    if (cedulaFiltro) {
      filtrado = filtrado.filter(
        (multa) =>
          multa.cedulaInfractor &&
          multa.cedulaInfractor.toString().includes(cedulaFiltro)
      );
    }

    setMultasFiltradas(filtrado);
  };

  // Estadísticas
  const cantidadPagadas = multasFiltradas.filter((multa) => multa.pagada).length;
  const cantidadPorPagar = multasFiltradas.filter((multa) => !multa.pagada)
    .length;

 // Gráfico de barras
 useEffect(() => {
  if (chart) {
    chart.destroy(); // Destruir gráfico anterior
  }

  const ctx = document.getElementById("chartAdministrativo").getContext("2d");

  // Calcular un rango dinámico
  const maxValor = Math.max(cantidadPagadas, cantidadPorPagar);
  const rangoMaximo = Math.ceil((maxValor + 1) / 10) * 5; // Redondear al múltiplo más cercano

  const nuevoChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Pagadas", "Por Pagar"],
      datasets: [
        {
          label: "Cantidad de Multas",
          data: [cantidadPagadas, cantidadPorPagar],
          backgroundColor: ["#88A0A8", "#B4CEB3"],
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: rangoMaximo, // Usar rango dinámico calculado
          ticks: {
            stepSize: 10, // Incremento entre cada marca
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
}, [multasFiltradas, cantidadPagadas, cantidadPorPagar]);


  // Descargar Excel
  const exportarExcel = () => {
    const filas = multasFiltradas.map((multa) => ({
      Fecha: new Date(multa.fecha).toLocaleDateString("es-ES"), // Formatear la fecha en español
      Cédula: multa.cedulaInfractor || "N/A", // Manejar cédulas vacías
      Monto: `₡${(multa.monto ?? 0).toLocaleString("es-ES", { // Usar 0 si `multa.monto` es undefined o null
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      Estado: multa.pagada ? "Pagada" : "Pendiente", // Estado en texto
    }));
  
    // Crear encabezados y filas con separador de punto y coma ";"
    const encabezados = "Fecha;Cédula;Monto;Estado";
    const contenido = filas
      .map(
        (fila) =>
          `${fila.Fecha};${fila.Cédula};${fila.Monto};${fila.Estado}`
      )
      .join("\n");
  
    // Generar el contenido del archivo CSV con codificación UTF-8 y BOM para caracteres especiales
    const csvContent = `data:text/csv;charset=utf-8,\ufeff${encabezados}\n${contenido}`;
  
    // Crear enlace para descargar
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reporte_multas_administrativo.csv");
    document.body.appendChild(link); // Agregar enlace temporalmente
    link.click(); // Simular clic para descargar
    document.body.removeChild(link); // Eliminar enlace después de descargar
  };
  
  

  // Descargar PDF
  const exportarPDF = () => {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new jsPDF.default();
        const logoUrl = `${process.env.PUBLIC_URL}/logo.png.jpeg`; // Ruta absoluta desde "public"
  
        // Cargar el logo y agregarlo al PDF
        const logoImage = new Image();
        logoImage.src = logoUrl;
        logoImage.onload = () => {
          doc.addImage(logoImage, "JPEG", 10, 10, 30, 30); // Logo ajustado
          doc.text("Reporte Administrativo", 50, 20);
          doc.text(`Generado por: ${userEmail}`, 50, 30);
  
          const filas = multasFiltradas.map((multa) => [
            new Date(multa.fecha).toLocaleDateString("es-ES"),
            multa.cedulaInfractor || "N/A",
            `₡${(multa.monto ?? 0).toLocaleString("es-ES", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`,
            multa.pagada ? "Pagada" : "Pendiente",
          ]);
  
          doc.autoTable({
            head: [["Fecha", "Cédula", "Monto", "Estado"]],
            body: filas,
            startY: 40,
            headStyles: { fillColor: "#007BFF" },
          });
  
          doc.save("reporte_multas_administrativo.pdf");
        };
      });
    });
  };
  

  return (
    <div className="reporte-container">
      <h3>Informe de Multas - Administrativo</h3>

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
        <div>
          <label htmlFor="cedulaFiltro">Cédula:</label>
          <input
            type="text"
            id="cedulaFiltro"
            placeholder="Cédula"
            value={cedulaFiltro}
            onChange={(e) => setCedulaFiltro(e.target.value)}
          />
        </div>
        <button className="btn-filter" onClick={filtrarMultas}>
          Filtrar
        </button>
      </div>

      <canvas id="chartAdministrativo"></canvas>

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

export default ReporteAdministrativo;
