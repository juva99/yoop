"use client";
import React, { useEffect, useState } from "react";

type Props = {
  lat: number;
  lon: number;
};

const apiKey = "3c51cb2eca5d25e813cd9b4c02dfc71e";

// פונקציה להחזרת אימוג'י לפי weatherId
function getWeatherEmoji(weatherId: number): string {
  switch (true) {
    case weatherId >= 200 && weatherId < 300:
      return "⛈️"; // Thunderstorm
    case weatherId >= 300 && weatherId < 400:
      return "🌦️"; // Drizzle
    case weatherId >= 500 && weatherId < 600:
      return "🌧️"; // Rain
    case weatherId >= 600 && weatherId < 700:
      return "❄️"; // Snow
    case weatherId >= 700 && weatherId < 800:
      return "🌫️"; // Atmosphere
    case weatherId === 800:
      return "☀️"; // Clear
    case weatherId > 800 && weatherId <= 804:
      return "☁️"; // Clouds
    default:
      return "🌈"; // Fallback
  }
}

const GetWeather: React.FC<Props> = ({ lat, lon }) => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [windSpeed, setWindSpeed] = useState<number | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [weatherId, setWeatherId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!lat || !lon) return;

    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=he&appid=${apiKey}`
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("שגיאה ב-API:", response.status, errorText);
          setError(`שגיאה: ${response.status}`);
          return;
        }

        const data = await response.json();
        //console.log(" תגובת API:", data);

        setTemperature(data.main.temp);
        setWindSpeed(data.wind.speed);
        setDescription(data.weather[0].description);
        setWeatherId(data.weather[0].id);
        setError(null);
      } catch (error) {
        console.error(" שגיאה בחיבור ל-API:", error);
        setError("שגיאת חיבור או רשת");
      }
    };

    fetchWeather();
  }, [lat, lon]);

  if (error) {
    return (
      <div className="mt-2 text-sm text-red-400 font-medium">
        {error}
      </div>
    );
  }

  if (
    temperature === null ||
    description === null ||
    windSpeed === null ||
    weatherId === null
  )
    return null;

  const weatherEmoji = getWeatherEmoji(weatherId);

  return (
    <div
      className="flex justify-between items-center w-80 px-4 py-2 rounded-xl  text-white font-bold shadow-md text-lg"
      dir="rtl"
    >
      {/* טקסט (טמפ׳, תיאור, רוח) */}
      <div>
        {/* טמפרטורה + תיאור */}
        <span className="text-l mr-5">{`${Math.round(temperature)}°C - ${description} ${weatherEmoji}`}</span>

        {/* שורת הרוח עם סמל */}
        <div className="flex items-center mt-1 ml-2">
        <img
            src="/windIcon.png"
            alt="wind icon"
            width={60}
            height={60}
            
          />
          <span className="text-l">{`${Math.round((windSpeed ?? 0) * 3.6)} קמ"ש`}</span>
        </div>
      </div>

    </div>
  );
};

export default GetWeather;
