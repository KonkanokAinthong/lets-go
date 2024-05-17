'use client';

import 'leaflet/dist/leaflet.css';

import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';

import 'leaflet-defaulticon-compatibility';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: {
    position: [number, number];
    icon?: L.Icon;
    content?: string;
  }[];
}

const Map = ({ center, zoom = 13, markers }: MapProps) => {
  const [map, setMap] = useState<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (map && userLocation) {
      map.setView(userLocation, zoom);
    }
  }, [map, userLocation, zoom]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, []);

  return (
    <MapContainer
      center={userLocation || center || [0, 0]}
      zoom={zoom}
      scrollWheelZoom={false}
      style={{ height: '600px', width: '100%' }}
      whenCreated={setMap}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {userLocation && (
        <Marker position={userLocation}>
          <Popup>You are here.</Popup>
        </Marker>
      )}
      {markers?.map((marker, index) => (
        <Marker key={index} position={marker.position} icon={marker.icon}>
          {marker.content && <Popup>{marker.content}</Popup>}
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
