'use client'

import { useEffect, useState } from 'react'
import { MagicButton } from './magic-button'

interface LocationGreetingProps {
  className?: string
}

interface WeatherData {
  temperature: number
  weatherCode: number
  windSpeed: number
}

interface LocationData {
  city: string
  country: string
  countryCode: string
  latitude: number
  longitude: number
}

const greetings: Record<string, { hello: string; from: string; welcome: string; flag: string }> = {
  US: { hello: 'Hello', from: 'from', welcome: 'Welcome', flag: '🇺🇸' },
  ES: { hello: 'Hola', from: 'desde', welcome: '¡Bienvenido', flag: '🇪🇸' },
  FR: { hello: 'Bonjour', from: 'de', welcome: 'Bienvenue', flag: '🇫🇷' },
  DE: { hello: 'Hallo', from: 'aus', welcome: 'Willkommen', flag: '🇩🇪' },
  IT: { hello: 'Ciao', from: 'da', welcome: 'Benvenuto', flag: '🇮🇹' },
  PT: { hello: 'Olá', from: 'de', welcome: 'Bem-vindo', flag: '🇵🇹' },
  NL: { hello: 'Hallo', from: 'van', welcome: 'Welkom', flag: '🇳🇱' },
  RU: { hello: 'Привет', from: 'из', welcome: 'Добро пожаловать', flag: '🇷🇺' },
  JP: { hello: 'こんにちは', from: 'から', welcome: 'ようこそ', flag: '🇯🇵' },
  KR: { hello: '안녕하세요', from: '에서', welcome: '환영합니다', flag: '🇰🇷' },
  CN: { hello: '你好', from: '来自', welcome: '欢迎', flag: '🇨🇳' },
  IN: { hello: 'नमस्ते', from: 'से', welcome: 'स्वागत है', flag: '🇮🇳' },
  BR: { hello: 'Olá', from: 'do', welcome: 'Bem-vindo', flag: '🇧🇷' },
  MX: { hello: 'Hola', from: 'desde', welcome: '¡Bienvenido', flag: '🇲🇽' },
  CA: { hello: 'Hello', from: 'from', welcome: 'Welcome', flag: '🇨🇦' },
  GB: { hello: 'Hello', from: 'from', welcome: 'Welcome', flag: '🇬🇧' },
  AU: { hello: 'G\'day', from: 'from', welcome: 'Welcome', flag: '🇦🇺' },
  AR: { hello: 'Hola', from: 'desde', welcome: '¡Bienvenido', flag: '🇦🇷' },
  default: { hello: 'Hello', from: 'from', welcome: 'Welcome', flag: '🌍' },
}

const weatherIcons: Record<number, string> = {
  0: '☀️', // Clear sky
  1: '🌤️', // Mainly clear
  2: '⛅', // Partly cloudy
  3: '☁️', // Overcast
  45: '🌫️', // Fog
  48: '🌫️', // Depositing rime fog
  51: '🌦️', // Light drizzle
  53: '🌦️', // Moderate drizzle
  55: '🌦️', // Dense drizzle
  61: '🌧️', // Slight rain
  63: '🌧️', // Moderate rain
  65: '🌧️', // Heavy rain
  71: '🌨️', // Slight snow
  73: '🌨️', // Moderate snow
  75: '🌨️', // Heavy snow
  80: '🌦️', // Slight rain showers
  81: '🌧️', // Moderate rain showers
  82: '🌧️', // Violent rain showers
  95: '⛈️', // Thunderstorm
  96: '⛈️', // Thunderstorm with slight hail
  99: '⛈️', // Thunderstorm with heavy hail
}

export function LocationGreeting({ className = '' }: LocationGreetingProps) {
  const [greeting, setGreeting] = useState<{ hello: string; from: string; welcome: string; flag: string } | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLocationAndWeather = async () => {
      try {
        // Get detailed location info including city and coordinates
        const locationResponse = await fetch('https://get.geojs.io/v1/ip/geo.json')
        const locationData = await locationResponse.json()
        
        const locationInfo: LocationData = {
          city: locationData.city,
          country: locationData.country,
          countryCode: locationData.country_code,
          latitude: parseFloat(locationData.latitude),
          longitude: parseFloat(locationData.longitude)
        }
        setLocation(locationInfo)
        
        // Get greeting based on country
        const selectedGreeting = greetings[locationInfo.countryCode] || greetings.default
        setGreeting(selectedGreeting)
        
        // Get weather forecast from Open-Meteo
        let weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${locationInfo.latitude}&longitude=${locationInfo.longitude}&current=temperature_2m,weather_code,wind_speed_80m&timezone=auto`
        )
        let weatherData = await weatherResponse.json()
        
        // Check if weather data has the expected structure
        if (weatherData && weatherData.current && 
            typeof weatherData.current.temperature_2m !== 'undefined' &&
            typeof weatherData.current.weather_code !== 'undefined') {
          
          let windSpeed = weatherData.current.wind_speed_80m;
          
          // If wind_speed_10m is not available, try wind_speed_80m with a separate call
          if (windSpeed === undefined || windSpeed === null) {
            try {
              weatherResponse = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${locationInfo.latitude}&longitude=${locationInfo.longitude}&current=temperature_2m,weather_code,wind_speed_80m&timezone=auto`
              )
              const fallbackWeatherData = await weatherResponse.json()
              
              if (fallbackWeatherData && fallbackWeatherData.current) {
                windSpeed = fallbackWeatherData.current.wind_speed_80m;
                // Update weatherData to use the fallback data for consistency
                weatherData = fallbackWeatherData;
              }
            } catch (fallbackError) {
              console.warn('Failed to fetch wind_speed_80m fallback:', fallbackError)
            }
          }
          
          if (windSpeed !== undefined && windSpeed !== null) {
            setWeather({
              temperature: Math.round(weatherData.current.temperature_2m),
              weatherCode: weatherData.current.weather_code,
              windSpeed: Math.round(windSpeed)
            })
          } else {
            console.warn('Neither wind_speed_10m nor wind_speed_80m available')
            // Still set weather data without wind speed if temperature and weather code are available
            setWeather({
              temperature: Math.round(weatherData.current.temperature_2m),
              weatherCode: weatherData.current.weather_code,
              windSpeed: 0 // Default to 0 if no wind data available
            })
          }
        } else {
          console.warn('Weather data structure is invalid or missing required fields:', weatherData)
          // Don't set weather data if the response is malformed
        }
        
      } catch (error) {
        console.error('Failed to fetch location or weather:', error)
        setGreeting(greetings.default)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocationAndWeather()
  }, [])

  if (isLoading) {
    return (
      <div className={`text-center space-y-2 ${className}`}>
        <p className="text-sm font-mono text-muted-foreground animate-pulse">
          Detecting your location...
        </p>
        {/* Placeholder for weather data to prevent layout shift */}
        <p className="text-xs font-mono text-muted-foreground/40 animate-pulse">
          🌡️ --°C • 💨 -- km/h • <span className="opacity-50">Do Magic</span>
        </p>
      </div>
    )
  }

  if (!greeting) return null

  const weatherIcon = weather ? weatherIcons[weather.weatherCode] || '🌡️' : '🌡️'

  return (
    <div className={`text-center space-y-2 ${className}`}>
      <p className="text-sm font-mono text-muted-foreground">
        {greeting.hello} {greeting.from} {location?.city || ''} {greeting.flag}! {greeting.welcome}!
      </p>
      {weather && (
        <p className="text-xs font-mono text-muted-foreground/80">
          {weatherIcon} {weather.temperature}°C • 💨 {weather.windSpeed} km/h • <MagicButton />
        </p>
      )}
    </div>
  )
}