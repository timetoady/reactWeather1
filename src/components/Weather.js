import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

//next, need to parse forcase data to display 5 day forcast, display it in cards.
//Then, on click show modal with 3 hour forcast for selected day.
export default function Weather() {
  const [location, setLocation] = useState("");
  const [tempSystem, setTempSystem] = useState("imperial");
  const [weatherObject, setWeatherObject] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [forecast, setForecast] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState([]);

  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };
  const toggle = () => setModal(!modal);
  function handleModal(day) {
    setModalTitle(`Hourly forecast for ${day[0].dt_txt.substring(0, 10)}:`);
    setModalContent(day);
    toggle();
  }

  const sortForecast = (forecastList) => {
    let day1 = forecastList.slice(0, 7);
    let day2 = forecastList.slice(8, 15);
    let day3 = forecastList.slice(16, 23);
    let day4 = forecastList.slice(24, 31);
    let day5 = forecastList.slice(32, 39);
    setForecast([day1, day2, day3, day4, day5]);
  };

  const getWeather = async (options) => {
    let options2 = JSON.parse(JSON.stringify(options));
    options2["url"] =
      "https://community-open-weather-map.p.rapidapi.com/forecast";
    try {
      const response1 = await axios.request(options);
      console.log("Weather:", response1.data);
      const response2 = await axios.request(options2);
      console.log("Forecast:", response2.data);
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
          sortForecast(weatherNow.forecast.list);
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
          <div>
            <div className="currentWeatherDiv">
            <p>The weather in </p>
            <h2 className="currentCity">{weatherObject.weather.name}</h2>
            <p>is</p>
            <h4 className="weatherType">{weatherObject.weather.weather[0].main}</h4>
            <h3 className="currentTemp">
              {weatherObject.weather.main.temp}°{" "}
              {tempSystem === "imperial" ? "F" : "C"}
            </h3>
            <p className="feelsLike">but feels like {weatherObject.weather.main.feels_like}.</p>
            
              </div>
              <h2>Forecast:</h2>
              <h6>for 3PM local time. Click to see hourly forecast for every three hours.</h6>
              <div className="forecastDiv">

              
        {forecast.map((day) => {
          //console.log(day);
          return (
            <div  key={day.dt_txt} onClick={() => handleModal(day)}>
              
              
                <p>{day[4].dt_txt.substring(0, 10)}</p>
                <p>{day[4].weather[0].main}</p>
                <p>
                  {day[4].main.temp}°{tempSystem === "imperial" ? "F" : "C"}
                </p>
             
              
                <Modal
                  isOpen={modal}
                  scrollable={true}
                  toggle={toggle}
                  className=""
                >
                  <ModalHeader toggle={toggle}>{modalTitle}</ModalHeader>
                  <ModalBody>
                  {modalContent.map((hour) => {
                      return (
                        <div className="hourlyDiv" key={hour.dt}>
                          <p><strong>{hour.dt_txt.substring(11)}</strong>: {hour.weather[0].main}, {hour.main.temp}°
                            {tempSystem === "imperial" ? "F" : "C"}
                          </p>
                        </div>
                      );
                    })}
                  </ModalBody>
                  <ModalFooter>
                   
                    <Button color="secondary" onClick={toggle}>
                      CLOSE
                    </Button>
                  </ModalFooter>
                </Modal>
              
            </div>
         
          );
        })}
</div>
          </div>
        ) : null}
        

      </div>
    </div>
  );
}
