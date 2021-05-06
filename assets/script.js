var apiKey = "12fbdc900826981bfac0d2ded9e6d205";
var baseCurrentAPIstring = "https://api.openweathermap.org/data/2.5/weather";
var uvAPIstring = "https://api.openweathermap.org/data/2.5/uvi";
var baseFiveDayAPIString = "https://api.openweathermap.org/data/2.5/onecall";
//REMOVE QUERY STRING FROM LINK

var currentWeatherEl = $(".current-weather");
var fiveDayWeatherEl = $(".five-day-weather");
var citySearchForm = $(".city-search-form");
var citySearchList = $(".city-list");

var lastCitySearched = "Dallas";
var currentCityLat = 0.0;
var currentCityLon = 0.0;



citySearchForm.on("submit", function (event) {
    event.preventDefault();
    var input = event.target[0].value;
    if (input != "") {
        fetchCityWeather(input);
    }
    localStorage.setItem("lastCity", input);

})

function startUp() {
    if (localStorage.getItem("lastCity")) {
        lastCitySearched = localStorage.getItem("lastCity");
    }
    fetchCityWeather(lastCitySearched);
    //Add list of recently searched
}



function displayCurrentWeather(data, uv) {
    currentWeatherEl.empty();
    var city = $(`<h2>${data.name} ${moment().format("L")}</h2>
        <img src=http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png>
        <div>Temperature: ${convertKelvinToFarenheit(data.main.temp)} F</div>
        <div>Humidity: ${data.main.humidity} %</div>
        <div>Wind Speed: ${Math.floor(data.wind.speed)} mph ${determineWindDirection(data.wind.deg)}</div>
        <div>UV Index: <span class="uv ${getUVColor(uv.value)}">${uv.value}</span></div>`);
    currentWeatherEl.append(city);
}
function displayFiveDay(data) {
    //TODO:
    console.log(data);
    fiveDayWeatherEl.empty();
    var day = moment().format("L");//Fix day increments
    for(var i = 1; i < 6; i++){
        var weatherday = data.daily[i]
        var singleDay = $(`<div class="five-day-single-day card col-2">
        <h6>${moment(weatherday.dt, "X").format("L")}</h6>
        <img src=http://openweathermap.org/img/wn/${weatherday.weather[0].icon}@2x.png>
        <div>${convertKelvinToFarenheit(weatherday.temp.max)}/${convertKelvinToFarenheit(weatherday.temp.min)} F</div>
        <div>Humidity: ${weatherday.humidity} %</div>
        <div>Wind Speed: ${Math.floor(weatherday.wind_speed)} mph ${determineWindDirection(weatherday.wind_deg)}</div>
        </div>`);
        fiveDayWeatherEl.append(singleDay);
    }
}

function fetchCityWeather(input) {
    var url = `${baseCurrentAPIstring}?q=${input}&appid=${apiKey}`;
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            currentCityLat = data.coord.lat;
            currentCityLon = data.coord.lon;
            var urlUV = `${uvAPIstring}?lat=${currentCityLat}&lon=${currentCityLon}&appid=${apiKey}`;
            fetch(urlUV)
                .then(response => response.json())
                .then(data2 => {
                    console.log(data2);
                    displayCurrentWeather(data, data2);
                })
                .then(() => {
                    console.log(currentCityLat, currentCityLon);
                    var fiveDayUrl = `${baseFiveDayAPIString}?lat=${currentCityLat}&lon=${currentCityLon}&exclude=current,minutely,hourly,alerts&appid=${apiKey}`;
                    fetch(fiveDayUrl)
                    .then(response => response.json())
                    .then(data3 => displayFiveDay(data3))
                })
        })
        .catch(() => {
            //Display city not found message
            console.log("City not Found")
        });
}

function fetchCityWeatherAll(input) {
    var urlCurrent = `${baseCurrentAPIstring}?q=${input}&appid=${apiKey}`;
    var url5Day = 
    console.log(url);
    Promise.all([fetch(url), ])
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            var urlUV = `${uvAPIstring}?lat=${data.coord.lat}&lon=${data.coord.lon}&appid=${apiKey}`;
            fetch(urlUV)
                .then(response => response.json())
                .then(data2 => {
                    console.log(data2);
                    displayCurrentWeather(data, data2);
                })
        })
        .catch(reject => {
            //Display city not found message
            console.log("City not Found")
        });
}
function getUVColor(uvValue) {
    if(uvValue > 10) {
        return "uv-violet";
    }
    else if(uvValue > 7) {
        return "uv-red";
    }
    else if(uvValue > 5) {
        return "uv-orange";
    }
    else if(uvValue > 2) {
        return "uv-yellow";
    }
    else {
        return "uv-green";
    }
}
function convertKelvinToFarenheit(temp) {
    return Math.floor((temp - 273.15) * 9 / 5 + 32);
}
function convertKelvinToCentigrade(temp) {
    return Math.floor(temp - 273.15);
}
function determineWindDirection(degree) {
    console.log(`${degree}: ${(degree + 22.5) / 45}`)
    switch (Math.floor((degree + 22.5) / 45)) {
        case 0: return "N";
        case 1: return "NE";
        case 2: return "E";
        case 3: return "SE";
        case 4: return "S";
        case 5: return "SW";
        case 6: return "W";
        case 7: return "NW";
        case 8: return "N";
        default: "N/A";
    }
}

//function calls
startUp();