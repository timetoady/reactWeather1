import React, { useState } from "react";
import getWeather from "./api.js";

export default function Weather() {
  const [location, setLocation] = useState("");
  const [tempSystem, setTempSystem] = useState("imperial");

  let options = {
    method: "GET",
    url: "https://community-open-weather-map.p.rapidapi.com/weather",
    params: {
      q: location,
      units: tempSystem,
    },
    headers: {
      "x-rapidapi-key": process.env.REACT_APP_WEATHER_API_KEY,
      "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
    },
  };

  const handleLocation = (event) => {
    setLocation(event.target.value);
  };

  const handleTemp = (event) => {
    console.log(event.target.value);
    setTempSystem(event.target.value);
  };

  return (
    <div className="container">
      <h2>Your Weather:</h2>
      <input
        type="text"
        autoFocus
        value={location}
        onChange={handleLocation}
        placeholder="Enter City"
      ></input>
      <button onClick={() => getWeather(options)}>Weather me:</button>

      <label>
        <input
          type="radio"
          id="imperial"
          name="temp"
          onClick={handleTemp}
          value="imperial"
        ></input>
        F°
      </label>

      <label>
        <input
          type="radio"
          name="temp"
          id="metric"
          onClick={handleTemp}
          value="metric"
        />
        C°
      </label>
    </div>
  );
}
