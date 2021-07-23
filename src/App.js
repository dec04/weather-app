import "reset.css";
import "./styles.scss";
import axios from "axios";
import { useState, useEffect } from "react";
import moment from "moment";
import { createApi } from "unsplash-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faHeart } from "@fortawesome/free-solid-svg-icons";
import { faGithubSquare } from "@fortawesome/free-brands-svg-icons";

const clearSkyDay =
  "https://basmilius.github.io/weather-icons/production/fill/all/clear-day.svg";
const clearSkyNight =
  "https://basmilius.github.io/weather-icons/production/fill/all/clear-night.svg";
const fewCloudsDay =
  "https://basmilius.github.io/weather-icons/production/fill/all/partly-cloudy-day.svg";
const fewCloudsNight =
  "https://basmilius.github.io/weather-icons/production/fill/all/partly-cloudy-night.svg";
const scatteredDay =
  "https://basmilius.github.io/weather-icons/production/fill/all/cloudy.svg";
const scatteredNight =
  "https://basmilius.github.io/weather-icons/production/fill/all/cloudy.svg";
const brokenCloudsDay =
  "https://basmilius.github.io/weather-icons/production/fill/all/overcast.svg";
const brokenCloudsNight =
  "https://basmilius.github.io/weather-icons/production/fill/all/overcast-night.svg";
const showerRainDay =
  "https://basmilius.github.io/weather-icons/production/fill/all/partly-cloudy-day-drizzle.svg";
const showerRainNight =
  "https://basmilius.github.io/weather-icons/production/fill/all/partly-cloudy-night-drizzle.svg";
const rainDay =
  "https://basmilius.github.io/weather-icons/production/fill/all/partly-cloudy-day-rain.svg";
const rainNight =
  "https://basmilius.github.io/weather-icons/production/fill/all/partly-cloudy-night-rain.svg";
const thunderstormDay =
  "https://basmilius.github.io/weather-icons/production/fill/all/thunderstorms-day.svg";
const thunderstormNight =
  "https://basmilius.github.io/weather-icons/production/fill/all/thunderstorms-night.svg";
const snowDay =
  "https://basmilius.github.io/weather-icons/production/fill/all/partly-cloudy-day-snow.svg";
const snowNight =
  "https://basmilius.github.io/weather-icons/production/fill/all/partly-cloudy-night-snow.svg";
const mistDay =
  "https://basmilius.github.io/weather-icons/production/fill/all/mist.svg";
const mistNight =
  "https://basmilius.github.io/weather-icons/production/fill/all/mist.svg";

export default function App() {
  let [image, setImage] = useState(
    "https://basmilius.github.io/weather-icons/production/fill/all/thermometer-colder.svg"
  );
  let [degrees, setDegrees] = useState("Loading...");
  let [cityName, setCityName] = useState("Loading...");
  let [updateImage, setUpdateImage] = useState("true");
  let [searchString, setSearchString] = useState("");
  let [additionalInfo, setAdditionalInfo] = useState("Loading...");
  let [likes, setLikes] = useState("Loading...");

  const unsplash = createApi({
    accessKey: "dFf1IKp0UfhBhREmOs0uOliYRwmk2MgXocVTokJgZu4"
  });

  const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const getbackgroundImage = (update = updateImage) => {
    setUpdateImage(false);

    if (update) {
      unsplash.search
        .getPhotos({
          query: "weather",
          page: 1,
          perPage: 100,
          orientation: "landscape"
        })
        .then((res) => {
          const imagePosition = getRandomNumber(0, res.response.results.length);
          console.log(res.response.results[imagePosition]);
          console.log(res.response.results.length, imagePosition);

          let description = "None";
          let likes = "None";

          if (res.response.results[imagePosition].description !== undefined) {
            description = res.response.results[imagePosition].description;
          }

          if (res.response.results[imagePosition].likes !== undefined) {
            likes = res.response.results[imagePosition].likes;
          }

          setAdditionalInfo(description);
          setLikes(likes);

          document.getElementById(
            "wrapper"
          ).style.backgroundImage = `url(${res.response.results[imagePosition].urls.regular})`;
        });
    }
  };

  const getWeatherInfo = async (city = "new%20york") => {
    return await axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=9052eacb976ecd8a2a6f012c694f7ac6`
      )
      .then((result) => {
        console.log(result.data);
        let img = getImageByWeatherConditionId(result.data.weather[0].id);

        setImage(img);
        setDegrees(parseInt(result.data.main.temp, 10));
        setCityName(result.data.name);

        getbackgroundImage(true);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      });
  };

  const getImageByWeatherConditionId = (id) => {
    if (id >= 200 && id < 300) {
      let image = isDay ? thunderstormDay : thunderstormNight;
      return image;
    } else if (id >= 300 && id < 500) {
      let image = isDay ? showerRainDay : showerRainNight;
      return image;
    } else if (id >= 500 && id < 600) {
      let image = isDay ? rainDay : rainNight;
      return image;
    } else if (id >= 600 && id < 700) {
      let image = isDay ? snowDay : snowNight;
      return image;
    } else if (id >= 700 && id < 800) {
      let image = isDay ? mistDay : mistNight;
      return image;
    } else if (id === 800) {
      let image = isDay ? clearSkyDay : clearSkyNight;
      return image;
    } else if (id === 801) {
      let image = isDay ? fewCloudsDay : fewCloudsNight;
      return image;
    } else if (id === 802) {
      let image = isDay ? scatteredDay : scatteredNight;
      return image;
    } else if (id === 803 || id === 804) {
      let image = isDay ? brokenCloudsDay : brokenCloudsNight;
      return image;
    }
  };

  const isDay = () => {
    let curTime = moment().zone("+07:00").format("HH");

    if (curTime >= 7 && curTime < 20) {
      return true;
    } else {
      return false;
    }
  };

  const changeHandler = (e) => {
    setSearchString(e.target.value);
  };

  useEffect(() => {
    getWeatherInfo();
    getbackgroundImage();
    document.addEventListener('keydown', function(event) {
      if (event.code == 'Enter') {
        getWeatherInfo(searchString);
        setSearchString("");
      }
    });
  }, []);

  return (
    <div id="wrapper" className="wrapper">
      <div className="control">
        <h3>Your City:</h3>
        <div>
          <input
            type="text"
            onChange={changeHandler.bind(this)}
            value={searchString}
          />
          <button
            onClick={() => {
              getWeatherInfo(searchString);
              setSearchString("");
            }}
          >
            Search
          </button>
        </div>
      </div>

      <div className="glass">
        <img src={image} alt="" />
        <h3>{degrees} &deg;C</h3>
        <h2>
          {moment().zone("+07:00").format("hh:mm")}{" "}
          <span>{moment().zone("+07:00").format("A")}</span>
        </h2>
        <h5>{cityName}</h5>
      </div>

      <div className="additional__info">
        <p>
          <FontAwesomeIcon icon={faInfoCircle} className="icon" />
          <span>{` Description: ${
            additionalInfo === null ? "None" : additionalInfo
          }`}</span>
        </p>
        <p>
          <FontAwesomeIcon icon={faHeart} className="icon" />
          <span>{` Likes: ${likes}`}</span>
        </p>
        <p>
          <FontAwesomeIcon icon={faGithubSquare} className="icon" /> From{"  "}
          <a href="https://github.com/dec04">dec04</a> with{"  "}
          <FontAwesomeIcon icon={faHeart} className="like-red" />
        </p>
      </div>
    </div>
  );
}
