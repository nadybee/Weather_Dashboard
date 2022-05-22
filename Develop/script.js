const now = new Date($.now())
const todayDate = dayjs(now).format("dddd, MMMM DD, YYYY ")
const currentHour = moment(now).format("H")
const currentCity = document.getElementById("current-city")
const currentWeather = document.getElementById("current-weather")
const currentTemp = document.getElementById("current-temp")
const currentWind = document.getElementById("current-wind")
const currentHumid = document.getElementById("current-humid")
const currentUv = document.getElementById("uv-index")
const searchInput = document.getElementById("search-city")
const searchButton = document.getElementById("search-button")
const cityButtons = document.getElementById("city-buttons")

// console.log(todayDate)
let apiKey = `de3fd87d905f359c0554152f4f41a427`
//nadybee
// let apiKey = `b03c84a6ad5bb97213f0e9baa8ef138b`
let lat;
let lon;
let cardHTML = []
let timezone
let city;
const geoCodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

const fetchCity = (URL) => {
    
  fetch(URL)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data)
      lat = data[0].lat
      lon = data[0].lon
      const weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
      fetchWeather(weatherURL)
    })
}
const fetchWeather = (URL) => {
  fetch(URL)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data)
      currentForcast(data)
      styleUV(data)
      fiveDayForcast(data)
    })
}

// fetchWeather(weatherURL)

/** FUNCTION TO ADD CURRENT FORCAST */

function currentForcast(data) {
  let currentIcon = data.current.weather[0].icon

  currentCity.innerHTML = `<div class="d-flex capitalize"> <h3> ${city} (${todayDate})</h3>`
  currentWeather.innerHTML = ` <img src="http://openweathermap.org/img/wn/${currentIcon}@4x.png" alt="weather icon" class="mx-auto" > </div>`
  currentTemp.innerHTML = `<h4> Temp: ${data.current.temp} °F`
  currentWind.innerHTML = `<h4> Wind: ${data.current.wind_speed} mph`
  currentHumid.innerHTML = `<h4> Humidity: ${data.current.humidity} %`
  currentUv.innerHTML = `<h4>UV index: <span class="badge"> ${data.current.uvi}</span></h4>`
}





/* FUNCTION TO ADD 5 DAY FORCAST CARDS TO PAGE */
function fiveDayForcast(data) {
    cardHTML =[]
  for (let i = 0; i < 5; i++) {
    let dates = new Date(data.daily[i].dt * 1000)
    let dateFormat = dayjs(dates).format("ddd DD")

    cardHTML.push(`
      <div class="card text-white background">
      <div class="card-title pt-3 mx-auto"> <h4>${dateFormat} </h4></div>
      <div class="card-body">
          <img src="http://openweathermap.org/img/wn/${
            data.daily[i].weather[0].icon
          }@2x.png" alt="weather icon" class="mx-auto my-0" >
          <div class="card-text"> Temp: ${Math.round(
            data.daily[i].temp.day
          )}°</div>
          <div class="card-text"> Wind: ${Math.round(
            data.daily[i].wind_speed
          )} mph</div>
          <div class="card-text"> Humid: ${data.daily[i].humidity}%</div>
      </div>
  </div>`)
  }

  document.querySelector(".card-deck").innerHTML = cardHTML.join("")
}

/** FUNCTION TO ADD CONDITIONAL STYLING TO UV INDEX */
function styleUV(data) {
  const uvBadge = document.querySelector(".badge")
  //   console.log(uvBadge)
  if (data.current.uvi <= 2.99) {
    uvBadge.classList.add("badge-success")
  } else if (data.current.uvi >= 3 && data.current.uvi < 6) {
    uvBadge.classList.add("badge-warning")
  } else if (data.current.uvi >= 6 && data.current.uvi < 8) {
    uvBadge.classList.add("bg-orange")
  } else if (data.current.uvi >= 8) {
    uvBadge.classList.add("badge-danger")
  } else {
    uvBadge.classList.add("badge-primary")
  }
}

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click()
  }
})


/** SET CITY and start weather search */
const startWeatherSearch=()=>{
    city =   searchInput.value.toLowerCase()
    fetchCity(geoCodeURL)
    searchHistory()
}

function searchHistory() {

  let searchValue = { search: searchInput.value.toLowerCase() }

  localStorage.setItem(
    `searchValue_${searchInput.value}`,
    JSON.stringify(searchValue)
  )

  renderSearchHistory()
  showSearchHistory()
  searchInput.value = ""
}

function renderSearchHistory() {
  let allSearch = []
  if (localStorage.length > 1) {
    for (let i = 0; i < localStorage.length; i++) {
      allSearch.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
    }
  }
  console.log(allSearch)

  //   console.log(allSearch[allSearch.length-2].search)
  // console.log(allSearch)
  return allSearch
}

function showSearchHistory() {
  let searchArr = []
  let cityButtonHTML = []

  const searchList = renderSearchHistory()
  for (let i = 0; i < searchList.length; i++) {
    if (!searchArr.includes(searchList[i])) {
    searchArr.push(searchList[i].search)
    }

  }
  for (let j = 0; j < searchArr.length; j++) {
    cityButtonHTML.push(
      `<div class="btn btn-dark btn-block capitalize" id="${searchArr[j]}"> ${searchArr[j]}</div>`
    )
    // console.log(cityButtonHTML)
  }
  cityButtons.innerHTML = cityButtonHTML.join("")
}

searchButton.addEventListener("click", startWeatherSearch)