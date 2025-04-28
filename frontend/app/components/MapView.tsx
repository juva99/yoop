"use client";

import React, { useState, useRef, useEffect } from "react";
import { Map, Marker } from "pigeon-maps";
import testData from "../data/testdata.json";
import { Game } from "@/app/types/Game";
import GameCard from "./GameCard";

const DEFAULT_RADIUS_KM = 30; // Default radius in kilometers

// Calculate distance between two points using Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

type Props = {
  defaultLocation: { lng: number; lat: number };
  games: Game[];
};

const MapView: React.FC<Props> = ({ defaultLocation, games }) => {
  const [selectedMarker, setSelectedMarker] = useState<Game | null>(null);
  const [gamesList, setGamesList] = useState<Game[]>(games);

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    defaultLocation.lat,
    defaultLocation.lng,
  ]);
  const [zoom, setZoom] = useState<number>(12);
  const [radius, setRadius] = useState<number>(DEFAULT_RADIUS_KM);
  const allMarkersRef = useRef<any[]>([]);
  const [visibleMarkers, setVisibleMarkers] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, visible: 0 });
  const mapRef = useRef<any>(null);

  // Initialize all valid markers
  useEffect(() => {
    const validStadiums = testData.filter(
      (stadium) => stadium.latitude && stadium.longitude,
    );
    allMarkersRef.current = validStadiums;
    setStats((prev) => ({ ...prev, total: validStadiums.length }));

    // Filter markers by initial radius
    filterMarkersByDistance(defaultLocation.lat, defaultLocation.lng, radius);
  }, [radius]);

  const handleMarkerClick = (game: any) => {
    setSelectedMarker(game);
    console.log("Game clicked:", game);
  };

  // Clear selected marker when clicking on the map (not on a marker)
  const handleMapClick = () => {
    if (selectedMarker) {
      setSelectedMarker(null);
    }
  };

  const filterMarkersByDistance = (
    centerLat: number,
    centerLng: number,
    radiusKm: number,
  ) => {
    if (!allMarkersRef.current) return;

    const filtered = allMarkersRef.current.filter((stadium) => {
      const distance = calculateDistance(
        centerLat,
        centerLng,
        stadium.latitude,
        stadium.longitude,
      );
      return distance <= radiusKm;
    });

    // Apply a reasonable limit if there are too many markers
    const maxMarkers = 200;
    const markersToShow =
      filtered.length > maxMarkers ? filtered.slice(0, maxMarkers) : filtered;

    setVisibleMarkers(markersToShow);
    setStats({
      total: allMarkersRef.current.length,
      visible: markersToShow.length,
    });
  };

  // Handle map events
  const handleMapChange = ({
    center,
    zoom,
  }: {
    center: [number, number];
    zoom: number;
  }) => {
    setMapCenter(center);
    setZoom(zoom);

    // Dynamically adjust radius based on zoom level
    const adjustedRadius = Math.max(10, DEFAULT_RADIUS_KM * (12 / (zoom + 1)));
    setRadius(adjustedRadius);

    // Filter markers based on new center and radius
    filterMarkersByDistance(center[0], center[1], adjustedRadius);
  };

  return (
    <div className="relative overflow-hidden rounded-md">
      <Map
        center={mapCenter}
        zoom={zoom}
        height={200}
        minZoom={7}
        maxZoom={18}
        onBoundsChanged={handleMapChange}
        onClick={handleMapClick}
        ref={mapRef}
      >
        {gamesList.map((game) => (
          <Marker
            key={game.id}
            width={30}
            anchor={[game.field.lat, game.field.lng]}
            onClick={() => handleMarkerClick(game)}
          />
        ))}
      </Map>
      {selectedMarker && (
        <div className="absolute start-4 bottom-4 rounded-md bg-white p-3 shadow-md">
          <GameCard game={selectedMarker} />
        </div>
      )}
    </div>
  );
};

export default MapView;
