'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface WeatherData {
  temperature: number
  weatherCode: number
  windSpeed: number
}

interface LocationData {
  latitude: number
  longitude: number
}

// Map weather codes to image filenames
const weatherImages: Record<string, string> = {
  sunny: '/profile-sunny.jpg',      // Clear sky (0, 1)
  cloudy: '/profile-cloudy.jpg',    // Cloudy/overcast (2, 3)
  rainy: '/profile-rainy.jpg',      // Rain/drizzle (51-65, 80-82)
  stormy: '/profile-stormy.jpg',    // Thunderstorms (95-99)
  snowy: '/profile-snowy.jpg',      // Snow (71-75)
  foggy: '/profile-foggy.jpg',      // Fog (45, 48)
  default: '/profile-default.jpg'   // Default fallback
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

export function WeatherProfileImage() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentImage, setCurrentImage] = useState(weatherImages.default)

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
        
        // Set image based on weather
        const weatherCategory = getWeatherCategory(weatherInfo.weatherCode)
        setCurrentImage(weatherImages[weatherCategory])
        
      } catch (error) {
        console.error('Failed to fetch weather:', error)
        setCurrentImage(weatherImages.default)
      } finally {
        setIsLoading(false)
      }
    }

    fetchWeather()
  }, [])

  return (
    <div className="relative">
      <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-border shadow-lg">
        {isLoading ? (
          <div className="flex h-full w-full items-center justify-center bg-muted animate-pulse">
            <div className="h-16 w-16 rounded-full bg-muted-foreground/20" />
          </div>
        ) : (
          <Image
            src={currentImage}
            alt="Profile picture based on current weather"
            fill
            className="object-cover transition-opacity duration-500"
            priority
            onError={() => setCurrentImage(weatherImages.default)}
          />
        )}
      </div>
      
      {/* Weather indicator overlay */}
      {weather && !isLoading && (
        <div className="absolute -bottom-2 -right-2 rounded-full bg-background border-2 border-border p-1 shadow-md">
          <div className="text-xs">
            {weather.weatherCode === 0 || weather.weatherCode === 1 ? '☀️' :
             weather.weatherCode === 2 || weather.weatherCode === 3 ? '☁️' :
             weather.weatherCode === 45 || weather.weatherCode === 48 ? '🌫️' :
             weather.weatherCode >= 51 && weather.weatherCode <= 65 ? '🌧️' :
             weather.weatherCode >= 71 && weather.weatherCode <= 75 ? '🌨️' :
             weather.weatherCode >= 80 && weather.weatherCode <= 82 ? '🌦️' :
             weather.weatherCode >= 95 && weather.weatherCode <= 99 ? '⛈️' : '🌡️'}
          </div>
        </div>
      )}
    </div>
  )
}