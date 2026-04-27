import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Vite/Webpack
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapPage = () => {
    const [crimes, setCrimes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCrimes = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/crimes?limit=500', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setCrimes(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCrimes();
    }, []);

    const getColor = (type) => {
        switch(type) {
            case 'Theft': return '#3B82F6';
            case 'Assault': return '#EF4444';
            case 'Homicide': return '#000000';
            case 'Fraud': return '#10B981';
            default: return '#8B5CF6';
        }
    };

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col gap-4 fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold italic">Crime Hotspots Map</h2>
                    <p className="text-gray-400">Interactive spatial distribution of reported incidents.</p>
                </div>
                <div className="flex items-center gap-4 glass-card px-4 py-2">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-accent-blue"></span><span className="text-xs">Theft</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-accent-red"></span><span className="text-xs">Assault</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-accent-purple"></span><span className="text-xs">Others</span></div>
                </div>
            </div>

            <div className="flex-1 rounded-2xl overflow-hidden border border-white/10 relative z-0">
                <MapContainer 
                    center={[22.5, 82.5]} 
                    zoom={5} 
                    style={{ height: '100%', width: '100%', background: '#0B0F1A' }}
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    {crimes.map((crime) => (
                        <CircleMarker 
                            key={crime._id}
                            center={[crime.coordinates.lat, crime.coordinates.lng]}
                            pathOptions={{ color: getColor(crime.type), fillColor: getColor(crime.type), fillOpacity: 0.6 }}
                            radius={6}
                        >
                            <Popup>
                                <div className="p-1">
                                    <h4 className="font-bold text-accent-blue">{crime.type}</h4>
                                    <p className="text-xs text-gray-600">{crime.location}</p>
                                    <p className="text-xs font-medium mt-1">{new Date(crime.date).toLocaleDateString()}</p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapPage;
