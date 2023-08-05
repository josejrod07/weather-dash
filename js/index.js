var apiKey = '931c9b978004cd5c67af5083b6aa9246';
var citiesElement = document.getElementById("searchHistory");
var weatherIconElement = document.getElementById("weatherIcon");
var cityNameElement = document.getElementById("cityName");
var currentDateElement = document.getElementById("currentDate");
var temperatureElement = document.getElementById("temperature");
var windSpeedElement = document.getElementById("windSpeed");
var humidityValueElement = document.getElementById("humidityValue");
var todayDate = dayjs();
var searchButtonElement = document.querySelector("#searchButton");
var searchHistoryArray = [];

// Function to display weather data
function displayWeatherData(data, i = 0) {
    var iconCode = data.list[i].weather[0].icon;
    weatherIconElement.src = `http://openweathermap.org/img/wn/${iconCode}.png`;
    cityNameElement.innerHTML = data.city.name;
    currentDateElement.innerHTML = todayDate.format("MM/D/YYYY");
    temperatureElement.innerHTML = "Temp: " + data.list[i].main.temp + "&#176;F";
    windSpeedElement.innerHTML = "Wind: " + data.list[i].wind.speed + " MPH";
    humidityValueElement.innerHTML = "Humidity: " + data.list[i].main.humidity + " %";
}

// Function to display 5-day forecast
function displayWeatherForecast(data) {
    for (let i = 1; i < 6; i++) {
        var j = i * 8 - 1;
        var dateForecastElement = document.getElementById("date-" + i);
        dateForecastElement.innerHTML = todayDate.add(i, 'day').format("MM/D/YYYY");
        var iconForecastElement = document.getElementById("icon-" + i);
        iconForecastElement.src = `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
        var tempForecastElement = document.getElementById("temp-" + i);
        tempForecastElement.innerHTML = "Temp: " + data.list[j].main.temp + "&#176;F";
        var windForecastElement = document.getElementById("wind-" + i);
        windForecastElement.innerHTML = "Wind: " + data.list[j].wind.speed + " MPH";
        var humidityForecastElement = document.getElementById("humidity-" + i);
        humidityForecastElement.innerHTML = "Humidity: " + data.list[j].main.humidity + " %";
    }
}

// Function to call weather API
function fetchWeatherAPI(city = 'orlando') {
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=imperial`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            console.log('Successful API Response');
            displayWeatherData(data);
            displayWeatherForecast(data);
        });
}

fetchWeatherAPI();

// Search button function
searchButtonElement.addEventListener("click", function () {
    var cityInput = document.getElementById("cityInput").value;
    if (!cityInput) return;

    localStorage.setItem("search-div", cityInput);
    var requestUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput}&appid=${apiKey}&units=imperial`;

    fetch(requestUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            var cityButtonElement = document.createElement("button");
            cityButtonElement.textContent = cityInput;
            cityButtonElement.setAttribute("class", "city-button");
            cityButtonElement.addEventListener("click", function () {
                fetchWeatherAPI(cityInput);
            });
            citiesElement.appendChild(cityButtonElement);

            searchHistoryArray.push(cityInput);
            if (searchHistoryArray.length > 5) {
                searchHistoryArray.shift();
                citiesElement.removeChild(citiesElement.firstElementChild);
            }

            displayWeatherData(data);
            displayWeatherForecast(data);
        });
});
