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

/** API KEYS */
let apiKey = `de3fd87d905f359c0554152f4f41a427`
//nadybee
// let apiKey = `b03c84a6ad5bb97213f0e9baa8ef138b`

/** DECLARED VARIABLES */
let lat
let lon
let cardHTML = []
let timezone

/**------- FETCH FUNCTIONS--------- */

/** FETCH CITY FUNCTION: called in startWeatherSearch() */
const fetchCity = (URL, city) => {
  fetch(URL)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data)
      if (data.length != 0) {
        lat = data[0].lat
        lon = data[0].lon

        const weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
        fetchWeather(weatherURL, city)
      } else {
        alert("☹️ City not found, please try again")
        searchInput.value = ""
      }
    })
}
/** FUNCTION TO FETCH WEATHER: CALLED IN fetchCity() */
const fetchWeather = (URL, city) => {
  fetch(URL)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data)
      currentForcast(data, city)
      styleUV(data)
      fiveDayForcast(data)
      searchHistory()
    })
}

/** FUNCTION TO ADD CURRENT FORCAST:CALLED IN fetchWeather() */
function currentForcast(data, city) {
  let currentIcon = data.current.weather[0].icon

  currentCity.innerHTML = `<div class="d-flex capitalize"> <h3> ${city} (${todayDate})</h3>`
  currentWeather.innerHTML = ` <img src="https://openweathermap.org/img/wn/${currentIcon}@4x.png" alt="weather icon" class="mx-auto" > </div>`
  currentTemp.innerHTML = `<h4> Temp: ${data.current.temp} °F`
  currentWind.innerHTML = `<h4> Wind: ${data.current.wind_speed} mph`
  currentHumid.innerHTML = `<h4> Humidity: ${data.current.humidity} %`
  currentUv.innerHTML = `<h4>UV index: <span class="badge"> ${data.current.uvi}</span></h4>`
}

/* FUNCTION TO ADD 5 DAY FORCAST CARDS TO PAGE: called in fetchWeather() */
function fiveDayForcast(data) {
  cardHTML = []
  for (let i = 0; i < 5; i++) {
    let dates = new Date(data.daily[i].dt * 1000)
    let dateFormat = dayjs(dates).format("ddd DD")

    cardHTML.push(`
      <div class="card text-white background">
      <div class="card-title pt-3 mx-auto"> <h4>${dateFormat} </h4></div>
      <div class="card-body mx-auto">
          <img src="https://openweathermap.org/img/wn/${
            data.daily[i].weather[0].icon
          }@2x.png" alt="weather icon" class="mx-auto my-auto" >
          <div class="card-text mt-2"><h5> Temp: ${Math.round(
            data.daily[i].temp.day
          )}°</h5></div>
          <div class="card-text"> < Wind: ${Math.round(
            data.daily[i].wind_speed
          )} mph </div>
          <div class="card-text"> Humid: ${data.daily[i].humidity}%</div>
      </div>
  </div>`)
  }

  document.querySelector(".card-deck").innerHTML = cardHTML.join("")
}

/** FUNCTION TO ADD CONDITIONAL STYLING TO UV INDEX: called in fetchWeather() */
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

/** SEARCH FOR A CITY FUNCTIONS */

/** STORES SEARCH IN LOCAL STORAGE, RENDERS DISPLAYS SEARCH HISTORY:
 * called in startWeatherSearch()
 */
function searchHistory() {
  let searchValue = { search: searchInput.value.toLowerCase() }
  if (searchValue.search != "") {
    localStorage.setItem(
      `searchValue_${searchInput.value}`,
      JSON.stringify(searchValue)
    )
  }

  renderSearchHistory()
  showSearchHistory()
  searchInput.value = ""
}

/** RENDERS THE SEARCH HISTORY FROM LOCAL STORAGE: called in SearchHistory() */
function renderSearchHistory() {
  let allSearch = []
  if (localStorage.length >= 1) {
    for (let i = 0; i < localStorage.length; i++) {
      allSearch.push(JSON.parse(localStorage.getItem(localStorage.key(i))))
    }
  }

  return allSearch
}

/** SHOWS SEARCH HISTORY ON PAGE: called in searchHistory() */
function showSearchHistory() {
  let searchArr = []
  let cityButtonHTML = []

  const searchList = renderSearchHistory()
  for (let i = 0; i < searchList.length; i++) {
    if (!searchArr.includes(searchList[i])) {
      searchArr.push(searchList[i].search)
    }
    // console.log(searchArr)
  }
  // searchArr.sort()
  for (let j = 0; j < 4; j++) {
    cityButtonHTML.push(
      `<div class="btn bg-grey btn-block capitalize" id="${searchArr[j]}"> ${searchArr[j]}</div>`
    )
    // console.log(cityButtonHTML)
  }
  cityButtons.innerHTML = cityButtonHTML.join("")
}
/**  start weather search */
const startWeatherSearch = () => {
  let city = searchInput.value.toLowerCase()
  const geoCodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`

  fetchCity(geoCodeURL, city)
  //   searchHistory()
}

/** ------------EVENT LISTENERS---------- */
/** make enter work for the search */
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click()
  }
})
searchButton.addEventListener("click", startWeatherSearch)

/** search history buttons give new results */
cityButtons.addEventListener("click", (event) => {
  let city = event.target.id
  const geoCodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`
  fetchCity(geoCodeURL, city)
})
