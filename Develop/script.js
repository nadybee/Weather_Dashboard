const now = new Date($.now())
const todayDate = moment(now).format("dddd, MMMM Do ")
const currentHour = moment(now).format("H")
const currentCity = document.getElementById('current-city')
const currentWeather = document.getElementById('current-weather')
const currentTemp = document.getElementById('current-temp')
const currentWind= document.getElementById('current-wind')
const currentHumid = document.getElementById('current-humid')
const currentUv= document.getElementById('uv-index')

console.log(todayDate)
// let apiKey = `de3fd87d905f359c0554152f4f41a427`
//nadybee
// let apiKey =`b03c84a6ad5bb97213f0e9baa8ef138b`
let lat = 40.2338
let lon = -111.6585
let city = "provo"



function findLocation() {
  $("#city-buttons").click((event) => {
    if (event.target.id === "austin") {
      city = "Austin"
      lat = 30.2672
      lon = -97.7431
    }
  })
}


const URL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
// const URL =`https://api.openweathermap.org/data/2.5/forecast/daily?lat=35&lon=139&cnt=10&appid=${apiKey}`
// const URL =`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&exclude=hourly&appid=${apiKey}&exclude=minutely,hourly&units=imperial`
// const URL =`https://api.openweathermap.org/data/2.5/forecast?q=${city},&appid=${apiKey}&exclude=minutely,hourly&units=imperial`
let cardHTML = []
// let jumbotronHTML
let timezone

const fetchWeather = (URL) => {
  fetch(URL)
    .then(function (response) {
      return response.json()
    })
    .then(function (data) {
      console.log(data.current)
   let currentIcon = data.current.weather[0].icon
   currentCity.innerHTML = `<div class="d-flex"> <h3> ${city} (${todayDate})</h3> <img src="http://openweathermap.org/img/wn/${currentIcon}.png" alt="weather icon" class="mx-auto" > </div>`
  currentTemp.innerHTML = `<h4> Temp: ${data.current.temp} °F`
  currentWind.innerHTML = `<h4> Wind: ${data.current.wind_speed} mph`
  currentHumid.innerHTML = `<h4> Humidity: ${data.current.humidity} %`
  currentUv.innerHTML = `<h4>UV index: <span class="badge badge-success"> ${data.current.uvi}</span></h4>`
/** FOR 5 DAY 3 HOUR */
    //   for (let i=0; i<data.list.length; i++) {
    //       console.log(data.list[i].dt_txt)
    //   }
/** FOR ONE CALL */
      for (let i = 0; i < 5; i++) {
        cardHTML.push(`
        <div class="card text-white background">
        <div class="card-title p-2"> ${data.daily[i].dt} </div>
        <div class="card-body">
            <img src="http://openweathermap.org/img/wn/${
              data.daily[i].weather[0].icon
            }@2x.png" alt="weather icon" class="mx-auto" >
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
    })
   
}
fetchWeather(URL)

// jumbotronHTML=`<h3 class="text-dark> ${city} (${data.current.dt})</h3> <h4> Temp:${data.current.temp}°</h4> <h4> Wind:  </h4>`
// $("#city-buttons").click(event =>{
//     if (event.target.id==='austin'){
//         city = "Austin"
//         lat = 30.2672
//         lon= -97.7431
//         console.log('austin')
//     }

// })
