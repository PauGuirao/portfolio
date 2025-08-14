'use client';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Image from 'next/image';
import visitedData from '../data/visited-countries.json';

const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center">
      <div 
        className="rounded-full flex items-center justify-center animate-pulse"
        style={{ width: 425, height: 425 }}
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
          <p className="text-sm">Loading globe...</p>
        </div>
      </div>
    </div>
  )
});

export default function VisitedGlobe() {
  const [currentPlaceIndex, setCurrentPlaceIndex] = useState(0);

  // Array of different colors for each point
  const colors = [
    '#ef4444', // red
    '#10b981', // emerald
    '#8b5cf6', // violet
    '#f97316', // orange
    '#ec4899', // pink
    '#84cc16', // lime
    '#ffffff', // sky
    '#2563eb', // blue
  ];

  const points = visitedData.visitedCountries.map((country, index) => ({
    lat: country.coordinates.lat,
    lng: country.coordinates.lng,
    city: country.city,
    country: country.country,
    description: country.description,
    image: country.image,
    color: colors[6] // Cycle through colors
  }));

  // Create arcs from the JSON flight paths data
  const arcs = visitedData.flightPaths.map((path, index) => ({
    startLat: path.startCoordinates.lat,
    startLng: path.startCoordinates.lng,
    endLat: path.endCoordinates.lat,
    endLng: path.endCoordinates.lng,
    color: colors[7] // Use different color for each arc
  }));

  // Smaller globe size to make room for the list
  const SIZE = 425;

  const nextPlace = () => {
    setCurrentPlaceIndex((prev) => (prev + 1) % points.length);
  };

  const prevPlace = () => {
    setCurrentPlaceIndex((prev) => (prev - 1 + points.length) % points.length);
  };

  const currentPlace = points[currentPlaceIndex];

  return (
    <div className="w-full flex flex-col items-center space-y-4 h-full">
      <div className="flex justify-center items-center flex-shrink-0">
        <Globe
          width={SIZE}
          height={SIZE}
          backgroundColor="rgba(255, 255, 255, 0)"
          showAtmosphere
          atmosphereAltitude={0.22}
          globeImageUrl="https://unpkg.com/three-globe@2.31.1/example/img/earth-dark.jpg"
          bumpImageUrl="https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png"
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.02}
          pointRadius={0.6}
          pointColor={(p: any) => p.color}
          pointLabel={(p: any) => `${p.city}, ${p.country}`}
          arcsData={arcs}
          arcStartLat="startLat"
          arcStartLng="startLng"
          arcEndLat="endLat"
          arcEndLng="endLng"
          arcColor="color"
          arcStroke={0.7}
        />
      </div>
      
      {/* Single Place Display with Navigation */}
      <div className="w-full max-w-xs flex-1 flex flex-col items-center space-y-3">
        {/* Current Place Card */}
        <div className="w-full text-xs overflow-hidden">
          {/* Image Section */}
          <div className="relative w-full h-52 bg-muted">
            <Image
              src='/places/barcelona.jpg' // Placeholder image, replace with currentPlace.image
              alt={`${currentPlace.city}, ${currentPlace.country}`}
              fill
              className="object-cover"
              onError={(e) => {
                // Fallback if image doesn't exist
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          
          {/* Content section with city text and navigation */}
          <div className="flex items-center justify-between py-3">
            {/* Text Content - Left aligned */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{currentPlace.city}</h4>
              <p className="text-muted-foreground mb-1">{currentPlace.country}</p>
            </div>

            {/* Navigation Arrows - Right aligned */}
            <div className="flex space-x-2 flex-shrink-0">
              <button
                onClick={prevPlace}
                className="p-2 text-foreground hover:text-muted-foreground transition-colors"
                aria-label="Previous place"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <button
                onClick={nextPlace}
                className="p-2 text-foreground hover:text-muted-foreground transition-colors"
                aria-label="Next place"
              >
                <svg 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
