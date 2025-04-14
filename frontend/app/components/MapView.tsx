"use client";

import React, { useState } from "react"
import { Map, Marker } from "pigeon-maps"

export function MapView() {
    const [clickInfo, setClickInfo] = useState<{ lat: number; lng: number } | null>(null);

    const handleMarkerClick = ({ anchor }: { anchor: [number, number] }) => {
        const [lat, lng] = anchor;
        setClickInfo({ lat, lng });
        console.log("Marker clicked at coordinates:", lat, lng);
    };

    return (
        <div className="rounded-md overflow-hidden">
            <Map defaultCenter={[50.879, 4.6997]} defaultZoom={11} height={200}>
                <Marker
                    width={50}
                    anchor={[50.879, 4.6997]}
                    onClick={handleMarkerClick}
                />
            </Map>
        </div>
    )
}
