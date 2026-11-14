window.addEventListener("load", function () {
    
// API Configuration
const API_KEY = "fe65364f65884fc5d27fcad3f682a99d";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";
const FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";

// Home Button
const homeBtn = document.getElementById("homeBtn");

// Search
const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const locationBtn = document.getElementById("locationBtn");

// Theme Toggle Button
const themeBtn = document.getElementById("themeBtn");

// Current Weather
const weatherIcon = document.getElementById("weatherIcon");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weatherDescription");
const cityName = document.getElementById("cityName");
const currentDate =  document.getElementById("currentDate");

// Weather Details
const feelsLike = document.getElementById("feelsLike");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const pressure = document.getElementById("pressure");
const visibility = document.getElementById("visibility");
const uvIndex = document.getElementById("uvIndex");

// Aditional Information
const sunrise = document.getElementById("sunrise");
const sunset = document.getElementById("sunset");
const airQuality = document.getElementById("airQuality");
const rainChance = document.getElementById("rainChance");

// Forecast Containers
const hourlyContainer = document.querySelector(".hourly-container");
const weeklyContainer = document.querySelector(".weekly-container");

// Reload Page
homeBtn.addEventListener("click", function(){

    location.reload();

});

// Theme Button
// Load saved theme
if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-mode");

    themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';

}

// Theme Toggle
themeBtn.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    const icon = themeBtn.querySelector("i");

    if (document.body.classList.contains("dark-mode")) {

        icon.classList.replace("fa-moon", "fa-sun");
        localStorage.setItem("theme", "dark");

    } else {

        icon.classList.replace("fa-sun", "fa-moon");
        localStorage.setItem("theme", "light");

    }

});

// Search Button
searchBtn.addEventListener("click", function() {
    const city = cityInput.value.trim();

    if (city === "") {
        alert("Please enter a city name.");
        return;
    }
    getWeatherData(city);
});

// Press Enter
cityInput.addEventListener("keydown", function(event){
    if(event.key === "Enter") {
        const city = cityInput.value.trim();

        if(city === "") {
            alert("Press enter a city name.");
            return;
        }
        getWeatherData(city);
    }
});

//Location Button
locationBtn.addEventListener("click", function(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    }
    else {
        alert("Geolocation is not supported.")
    }
});

function showWeatherSections() {

    const welcome = document.getElementById("welcomeSection");

    welcome.classList.add("fade-out");

    setTimeout(function () {

        welcome.style.display = "none";

    }, 500);

    const sections = [
        document.getElementById("currentWeather"),
        document.getElementById("weatherDetails"),
        document.getElementById("hourlyForecast"),
        document.getElementById("weeklyForecast"),
        document.getElementById("additionalInfo")
    ];

    sections.forEach(function(section){

        if(section.id === "weatherDetails" || section.id === "additionalInfo"){

            section.style.display = "grid";

        } else{

            section.style.display = "block";

        }

        section.classList.add("fade-in");

    });

}

// Get Weather Data
function getWeatherData(city) {
    const apiurl = `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(apiurl) 

       .then(function (response) {

        if(!response.ok) {

            throw new Error("City not found");

        }

        return response.json();

       })

    .then(function(data){

    console.log(data);

    updateWeatherUI(data);

    updateBackground(data);

    getForecast(city);

    showWeatherSections();

})

       .catch(function (error){
        alert(error.message);
       });

}

// Location Success
function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    getWeatherByLocation(latitude, longitude);
}

// Location Error
function error() {

    alert("Unable to retrieve your location.");

}

// Get Location
function getWeatherByLocation(lat, lon) {
    const apiUrl = `${BASE_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;

    fetch(apiUrl)
      .then(function(response) {
        if(!response.ok){
             throw new Error("Unable to fetch location weather.");
        }

        return response.json();
      })

      .then(function(data){

    console.log(data);

    updateWeatherUI(data);

    updateBackground(data);

    getForecast(data.name);

    showWeatherSections();

})

      .catch(function(error){
        alert(error.message);
      });
}

// Update Weather UI
function updateWeatherUI(data) {

    cityName.textContent = data.name;

    temperature.textContent =
        Math.round(data.main.temp) + "°C";

    const description = data.weather[0].description;

    weatherDescription.textContent =
        description.charAt(0).toUpperCase() +
        description.slice(1);

    weatherIcon.src =
        `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    weatherIcon.alt = description;

    feelsLike.textContent =
        Math.round(data.main.feels_like) + "°C";

    humidity.textContent =
        data.main.humidity + "%";

    windSpeed.textContent =
        Math.round(data.wind.speed) + " m/s";

    pressure.textContent =
        data.main.pressure + " hPa";

    visibility.textContent =
        Math.round(data.visibility / 1000) + " km";

    const sunriseTime =
        new Date(data.sys.sunrise * 1000);

    sunrise.textContent =
        sunriseTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    const sunsetTime =
        new Date(data.sys.sunset * 1000);

    sunset.textContent =
        sunsetTime.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    currentDate.textContent =
        new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric"
        });

}

// Get Forecast
function getForecast(city) {

    const apiUrl =
        `${FORECAST_URL}?q=${city}&appid=${API_KEY}&units=metric`;

    fetch(apiUrl)

        .then(function(response) {

            if (!response.ok) {
                throw new Error("Forecast not found.");
            }

            return response.json();

        })

        .then(function(data) {

            console.log(data);

            hourlyContainer.innerHTML = "";

            for (let i = 0; i < 8; i++) {

                const forecast = data.list[i];

                const time = new Date(forecast.dt * 1000)
                    .toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                const temp = Math.round(forecast.main.temp);

                const icon =
                    forecast.weather[0].icon;

                hourlyContainer.innerHTML += `

                    <article class="hour-card">

                        <p>${time}</p>

                        <img
                            src="https://openweathermap.org/img/wn/${icon}@2x.png"
                            alt="Weather Icon"
                        >

                        <p>${temp}°C</p>

                    </article>

                `;

            }

            weeklyContainer.innerHTML = "";

            for(let i = 0; i < data.list.length; i += 8) {
                const forecast = data.list[i];
                if (!forecast) {
                    continue;
                }

                const day = new Date(forecast.dt * 1000)
                  .toLocaleDateString("en-Us", {
                    weekday: "short" 
                  });

                  const icon = forecast.weather[0].icon;
                  const temp = Math.round(forecast.main.temp);
                  const description = forecast.weather[0].main;

                  weeklyContainer.innerHTML += `

                    <article class="week-card">

                        <p>${day}</p>

                        <img
                            src="https://openweathermap.org/img/wn/${icon}@2x.png"
                            alt="${description}"
                        >

                        <p>${temp}°C</p>

                        <p>${description}</p>

                    </article> `;
            }

        })

        .catch(function(error) {

            console.log(error);

        });

}

// Change Background Based on Weather
function updateBackground(data) {

    const weather = data.weather[0].main;
    const icon = data.weather[0].icon;

    let image = "images/background-1.jpg";

    // Night
    if (icon.endsWith("n")) {
        image = "images/night.jpg";
    }

    // Day Weather
    else {
        switch (weather) {

            case "Clear":
                image = "images/sunny.jpg";
                break;

            case "Clouds":
                image = "images/background-1.jpg";
                break;

            case "Rain":
            case "Drizzle":
                image = "images/rainy.jpg";
                break;

            case "Snow":
                image = "images/snow.jpg";
                break;

            case "Thunderstorm":
                image = "images/thunderstrom.jpg";
                break;

            default:
                image = "images/background-1.jpg";
        }
    }

    document.body.style.background =
        `linear-gradient(
            rgba(255,255,255,.20),
            rgba(255,255,255,.20)
        ),
        url("${image}")`;

    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundPosition = "center";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundAttachment = "fixed";
}


});

