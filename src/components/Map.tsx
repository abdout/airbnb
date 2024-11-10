"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Flag from "react-world-flags";
import ReactDOMServer from "react-dom/server";

// Import images
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type Props = {
  center?: [number, number];
  locationValue?: string;
};

function Map({ center, locationValue }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Configure the default icon only once
  useEffect(() => {
    if (typeof window !== "undefined" && L.Icon.Default) {
      // @ts-ignore
      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconUrl: (markerIcon as any).src || markerIcon,
        iconRetinaUrl: (markerIcon2x as any).src || markerIcon2x,
        shadowUrl: (markerShadow as any).src || markerShadow,
      });
    }
  }, []);

  useEffect(() => {
    // Check if map is already initialized
    if (mapRef.current) {
      return;
    }

    // Define initial center and zoom
    const initialCenter: [number, number] = center || [51, -0.09];
    const initialZoom = center ? 4 : 2;

    // Initialize the map
    const map = L.map(mapContainerRef.current!).setView(
      initialCenter,
      initialZoom
    );

    // Add a tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Add a marker if center is provided
    if (center) {
      const marker = L.marker(center).addTo(map);

      if (locationValue) {
        // Render the React component to a string
        const popupContent = ReactDOMServer.renderToString(
          <div className="flex justify-center items-center animate-bounce">
            <Flag code={locationValue} className="w-10" />
          </div>
        );

        marker.bindPopup(popupContent);
      }
    }

    // Save the map instance
    mapRef.current = map;
  }, [center, locationValue]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={mapContainerRef} className="h-[35vh] rounded-lg"></div>;
}

export default Map;
