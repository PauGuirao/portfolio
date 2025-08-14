'use client'

import { useState, useEffect } from 'react'

interface MagicButtonProps {
  className?: string
}

interface WeatherData {
  temperature: number
  weatherCode: number
  windSpeed: number
}

interface LocationData {
  latitude: number
  longitude: number
}

// Map weather codes to background image filenames
const weatherBackgrounds: Record<string, string> = {
  sunny: '/magic-background-sunny.jpg',      // Clear sky (0, 1)
  cloudy: '/magic-background-cloudy.jpg',    // Cloudy/overcast (2, 3)
  rainy: '/magic-background-rainy.jpg',      // Rain/drizzle (51-65, 80-82)
  stormy: '/magic-background-stormy.jpg',    // Thunderstorms (95-99)
  snowy: '/magic-background-snowy.jpg',      // Snow (71-75)
  foggy: '/magic-background-foggy.jpg',      // Fog (45, 48)
  default: '/magic-background.jpg'           // Default fallback
}

// Function to determine weather category from weather code
const getWeatherCategory = (weatherCode: number): string => {
  if (weatherCode === 0 || weatherCode === 1) return 'sunny'
  if (weatherCode === 2 || weatherCode === 3) return 'cloudy'
  if (weatherCode === 45 || weatherCode === 48) return 'foggy'
  if (weatherCode >= 51 && weatherCode <= 65) return 'rainy'
  if (weatherCode >= 71 && weatherCode <= 75) return 'snowy'
  if (weatherCode >= 80 && weatherCode <= 82) return 'rainy'
  if (weatherCode >= 95 && weatherCode <= 99) return 'stormy'
  return 'default'
}

export function MagicButton({ className = '' }: MagicButtonProps) {
  const [showBackground, setShowBackground] = useState(false)
  const [currentBackground, setCurrentBackground] = useState(weatherBackgrounds.default)
  const [weather, setWeather] = useState<WeatherData | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Get user location
        const locationResponse = await fetch('https://get.geojs.io/v1/ip/geo.json')
        const locationData = await locationResponse.json()
        
        const location: LocationData = {
          latitude: parseFloat(locationData.latitude),
          longitude: parseFloat(locationData.longitude)
        }
        
        // Get weather forecast
        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code,wind_speed_10m&timezone=auto`
        )
        const weatherData = await weatherResponse.json()
        
        const weatherInfo: WeatherData = {
          temperature: Math.round(weatherData.current.temperature_2m),
          weatherCode: weatherData.current.weather_code,
          windSpeed: Math.round(weatherData.current.wind_speed_10m)
        }
        
        setWeather(weatherInfo)
        
        // Set background image based on weather
        const weatherCategory = getWeatherCategory(weatherInfo.weatherCode)
        setCurrentBackground(weatherBackgrounds[weatherCategory])
        
      } catch (error) {
        console.error('Failed to fetch weather:', error)
        setCurrentBackground(weatherBackgrounds.default)
      }
    }

    fetchWeather()
  }, [])

  const toggleBackground = () => {
    setShowBackground(!showBackground)
  }

  return (
    <>
      {/* Background overlay with cloudy fade animation */}
      {showBackground && (
        <div 
          className="fixed inset-0 z-0 animate-cloud-fade-in"
          style={{
            backgroundImage: `url(${currentBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            opacity: 0,
            animation: 'cloudFadeIn 3s ease-out forwards',
          }}
          onClick={() => setShowBackground(false)}
        />
      )}
      
      {/* Simple text button */}
      <button
        onClick={toggleBackground}
        className={`relative z-10 inline-flex items-center gap-1 text-xs font-mono text-muted-foreground/60 hover:text-muted-foreground transition-colors duration-200 ${className}`}
      >
        {showBackground ? 'close' : (
          <>
            do magic
            <span className="transition-transform duration-200 hover:translate-x-0.5">→</span>
          </>
        )}
      </button>
      
      {/* Add the keyframe animation styles */}
      <style jsx>{`
        @keyframes cloudFadeIn {
          0% {
            opacity: 0;
            transform: scale(1.1);
            filter: blur(12px) brightness(0.8);
          }
          20% {
            opacity: 0.1;
            transform: scale(1.08);
            filter: blur(10px) brightness(0.85);
          }
          40% {
            opacity: 0.2;
            transform: scale(1.05);
            filter: blur(9px) brightness(0.9);
          }
          60% {
            opacity: 0.25;
            transform: scale(1.02);
            filter: blur(8px) brightness(0.95);
          }
          80% {
            opacity: 0.28;
            transform: scale(1.01);
            filter: blur(8px) brightness(0.98);
          }
          100% {
            opacity: 0.3;
            transform: scale(1);
            filter: blur(8px) brightness(1);
          }
        }
      `}</style>
    </>
  )
}