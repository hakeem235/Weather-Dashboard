//Declare a variable to store the searched city
var city = "";
// variable declaration
var placesEl = $('#places');
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty = $("#humidity");
var currentWSpeed = $("#wind-speed");
var currentUvindex = $("#uv-index");
var sCity = [];
var apiKey = "cd7b46258d74ce0db68ce9bc4d5cbf2e";



searchButton.click(function () {

  //get name and its value
  var cities = $('input[id="search-city"]').val();
  //refactor url
  var weatherUrl = generateURL(cities);
  currentWeather(weatherUrl)

  //if empty
  if (!cities) {
    alert("No cities chosen")
    return;
  }

  //print
  placesEl.append('<li>' + cities + '</li>');
  $(placesEl).children().attr("class", "list-group-item")
  $('.list-group').css('visibility', 'visible');
  $('.btn-secondary').css('visibility', 'visible');
  $('.list-group-item').click(function () {
    var clickedCity = $(this).html();
    currentWeather(weatherUrl)
  })

  //clear input
  $('input[id="search-city"]').val('');

  //save at local storage
  localStorage.setItem('places', cities);

});

function generateURL(cities) {
  var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cities + '&appid=' + apiKey;
  return weatherUrl;
}



function showWeather(event) {
  event.preventDefault();
  if (inputCity.val() !== "") {
    place = inputCity.value();
    currentWeather(place);
  }
};

function currentWeather(weatherUrl) {
  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      var currentDate = moment().format('ll');
      var weatherIcon = data.weather[0].icon;
      var iconUrl = "https://openweathermap.org/img/wn/" + weatherIcon + ".png";
      console.log(iconUrl)
      //parse the response for name of city and concanatig the date and icon.
      $('#current-city').text(data.name + " " + currentDate);
      $("<img>").attr("src", iconUrl).prependTo("#current-weather")
      var temp = (data.main.temp - 273.15);
      $('#temperature').text(" " + temp.toFixed(0) + ' °C');
      $('#humidity').text(" " + data.main.humidity + "%");
      $('#wind-speed').text(" " + data.wind.speed.toFixed(1) + ' MPH');
    })
}

//get UV Index
 var lat = data.coord.lat;
 var lon = data.coord.lon;
 var uvIndexUrl = 'https://api.openweathermap.org/data/2.5/uvi?lat=' + lat + '&lon=' + lon + '&appid=' + apiKey;
  console.log(lat);
  console.log(lon)
  fetch(uvIndexUrl)
   .then(function (response) {
     return response.json();
     })
     .then(function (data) {
        $('#uvIndex').text('UV Index: ' + data.value)
      })