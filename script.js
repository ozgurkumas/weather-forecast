const searchButton = document.querySelector(".search-btn");
const cityInput = document.querySelector(".city-input");
const weatherCards = document.querySelector(".weather-cards")
const currentWeather = document.querySelector(".current-weather")
const locationButton = document.querySelector(".location-btn");

const API_KEY = "eb2b616811ad0efacfc0922375349642"

const createWeatherItem = (cityName, weatherItem, index) => {
    if(index === 0) {
        return `<div class="current-weather">
                    <div class="details">
                        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)} C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </div>
                    <div class="icon">
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="icon">
                        <h4>${weatherItem.weather[0].description}</h4>
                    </div>
                </div>`;
    }else {
        return `<li class="card">
                <h3>(${weatherItem.dt_txt.split(" ")[0]})</h2>
                <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="icon">
                <h4>Temp: ${(weatherItem.main.temp - 273.15).toFixed(2)} C</h4>
                <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                <h4>Humidity: ${weatherItem.main.humidity}%</h4>
            </li>`;
    }
}

const getWeatherDetails = (cityName, lat, lon) => {
    const GET_WEATHER_API = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;

    fetch(GET_WEATHER_API).then(res => res.json()).then( data => {
        //console.log(data)
        const forecastDays = [];
        const fiveDaysForecast = [];


        
        data.list.forEach( (forecast) => {
            const forecastDay = new Date(forecast.dt_txt).getDate()
            if(!forecastDays.includes(forecastDay)) {
                forecastDays.push(forecastDay)
                fiveDaysForecast.push(forecast)
            }
        });

        console.log(fiveDaysForecast);

        cityInput.value = "";
        weatherCards.innerHTML = "";
        currentWeather.innerHTML = "";

        fiveDaysForecast.forEach( (weatherItem, index) => {
            if(index === 0) {
                currentWeather.insertAdjacentHTML("beforeend", createWeatherItem(cityName, weatherItem, index));
            }else {
                weatherCards.insertAdjacentHTML("beforeend", createWeatherItem(cityName, weatherItem, index));
            }
        });

    }).catch( () => {
        alert("An error occurred while fetching the weather forecast");
    });
}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if(!cityName) return;

    const GEOCODING_API_URL = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${API_KEY}`

    fetch(GEOCODING_API_URL).then(res => res.json()).then(data => {
        if(!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0]
        getWeatherDetails(name, lat, lon);
    }).catch( () => {
        alert("An error occurred while fetching the coordinates");
    });

}

const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition( 
        position => {
            const lat = position.coords.latitude
            const lon = position.coords.longitude
            const GET_CITY_NAME_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;
            

            fetch(GET_CITY_NAME_URL).then(res => res.json()).then(data => {
                cityName = data[0].name;
                getWeatherDetails(cityName, lat, lon);
            }).catch( () => {
                alert("An error occurred while fetching the city name");
            });
        },
        error => {
        console.log(error)
    }
    )
}

locationButton.addEventListener("click", getUserCoordinates)

searchButton.addEventListener("click", getCityCoordinates)
