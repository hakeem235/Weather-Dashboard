

var placesEl = $('#places');
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var clearButton = $("#clear-history");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty = $("#humidity");
var currentWSpeed = $("#wind-speed");
var currentUvindex = $("#uv-index");
var myCities = [];
var apiKey = "cd7b46258d74ce0db68ce9bc4d5cbf2e";

function getCities() {
  var storage = localStorage.getItem('places')
  if (storage) {
    myCities = JSON.parse(storage)
    myCities.forEach(city => { printCities(city) })
  }
}

getCities();

function printCities(city) {
  placesEl.append('<li>' + (city).toUpperCase() + '</li>');
  $(placesEl).children().attr("class", "list-group-item")
  $('.list-group').css('visibility', 'visible');
  $('.btn-secondary').css('visibility', 'visible');
}


$('#places').on('click', '.list-group-item', function () {
  let clickedCity = ''
  clickedCity = $(this).html();
  console.log(clickedCity)
  var weatherUrl = generateURL(clickedCity);
  currentWeather(weatherUrl);
  fiveDayForecast(clickedCity);
  $('#mainCity').show();
  $('#future-weather').show();
})



searchButton.click(function () {
  //get name and its value
  var cities = $('input[id="search-city"]').val();
  //refactor url
  var weatherUrl = generateURL(cities);
  currentWeather(weatherUrl);
  fiveDayForecast(cities);

  //if empty
  if (!cities) {
    // alert("No cities chosen")
    return;
  }
  printCities(cities)
  currentWeather(weatherUrl)
  //clear input
  $('input[id="search-city"]').val('');

  myCities.push(cities)

  //save at local storage
  localStorage.setItem('places', JSON.stringify(myCities));

})

searchButton.click(function () {

  $('#mainCity').show();
  $('#future-weather').show();
})

function generateURL(cities) {
  var weatherUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cities + '&units=metric&appid=' + apiKey;
  return weatherUrl;
}

function showWeather(event) {
  event.preventDefault();
  if (inputCity.val() !== "") {
    place = inputCity.value();
    currentWeather(place);
  }
};
// get current weather
function currentWeather(weatherUrl) {
  fetch(weatherUrl)
    .then(function (response) {
      return response.json();
    })

    .then(function (data) {
      var currentDate = moment().format('L');
      var weatherIcon = data.weather[0].icon;
      var iconUrl = 'https://openweathermap.org/img/wn/' + weatherIcon + '.png';
      //parse the response for name of city and concanatig the date and icon.
      $('#current-city').text((data.name.toUpperCase()) + " " + currentDate);
      $("<img>").attr("src", iconUrl).appendTo("#current-city")
      var temp = (data.main.temp);
      $('#temperature').text(" " + temp.toFixed(0) + ' °C');
      $('#humidity').text(" " + data.main.humidity + "%");
      $('#wind-speed').text(" " + data.wind.speed.toFixed(1) + ' MPH');

      //get UV Index
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      var uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      fetch(uvIndexUrl)
        .then(function (response) {
          return response.json();
        })
        .then(function (data) {
          $('#uv-index').text(" " + data.value)
          if (data.value <= 2) {
            $('#uv-index').css('background-color', 'yellow')
          } else if (data.value <= 5) {
            $('#uv-index').css('background-color', 'orange')
          } else if (data.value <= 7) {
            $('#uv-index').css('background-color', 'red')
          } else {
            $('#uv-index').css('background-color', 'violet')
          }
        })
    })
}
