import React, { useState, useEffect } from "react";
import axios from "axios";

//next, need to parse forcase data to display 5 day forcast, display it in cards.
//Then, on click show modal with 3 hour forcast for selected day.
export default function Weather() {
  const [location, setLocation] = useState("");
  const [tempSystem, setTempSystem] = useState("imperial");
  const [weatherObject, setWeatherObject] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const getWeather = async (options) => {
    let options2 = JSON.parse(JSON.stringify(options));
    options2["url"] =
      "https://community-open-weather-map.p.rapidapi.com/forecast";
    try {
      const response1 = await axios.request(options);
      console.log(response1);
      const response2 = await axios.request(options2);
      console.log(response2);
      if (response1.status === 404 || response2.status === 404) {
        console.log("Error 404!");
        setErrorText("City not found. Please check for errors and try again.");
        return {};
      } else {
        setErrorText("");
        const response = {
          weather: response1.data,
          forecast: response2.data,
          status: response1.status,
        };
        console.log(response);
        return response;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLocation = (event) => {
    setLocation(event.target.value);
  };

  const handleTemp = (event) => {
    setTempSystem(event.target.value);
  };

  useEffect(() => {
    let currentQuery = true;
    const controller = new AbortController();
    const loadWeather = async () => {
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

      if (!location || location.trim() === "") return setWeatherObject({});
      await sleep(600);
      if (currentQuery) {
        setLoading(true);
        //showLoading();
        const weatherNow = await getWeather(options);
        if (!weatherNow) {
          setLoading(false);
          setErrorText("Oops! Couldn't find that city. Try again.");
          return setWeatherObject({});
        } else {
          setErrorText("");
          setWeatherObject(weatherNow);
          setLoading(false);
        }

        //hideLoading();
      }
    };
    loadWeather();
    return () => {
      currentQuery = false;
      controller.abort();
    };
  }, [location, tempSystem]);

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

      <label>
        <input
          type="radio"
          id="imperial"
          name="temp"
          defaultChecked={true}
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
      <div className="weatherDisplay">
        {weatherObject && loading ? <h3>Searching weather info...</h3> : null}
        {errorText ? <h3>{errorText}</h3> : null}
        {!errorText && weatherObject.weather && location ? (
          <h3>Temp: {weatherObject.weather.main.temp}</h3>
        ) : null}
      </div>
    </div>
  );
}
