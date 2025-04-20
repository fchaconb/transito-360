import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

function HeatMap({ points }) {
    const map = useMap();  // Obtener el mapa de React Leaflet

    useEffect(() => {
        if (!map) return;

        // Crear la capa de calor
        const heatLayer = L.heatLayer(points, { radius: 25 }).addTo(map);

        // Limpiar la capa de calor cuando el componente se desmonta
        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, points]);

    return null;
}

export default HeatMap;
