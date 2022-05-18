const now = new Date($.now())
const todayDate = moment(now).format("dddd, MMMM Do, h:mm a z")
const currentHour = moment(now).format("H")

console.log(todayDate)
let apiKey = `81764070bcb422c925d6bb91e367c480`
let lat = 33.44
let lon = -90.04
const URL=   `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
let cardHTML = []
let timezone;

const fetchWeather=(URL) => {
fetch(URL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
      console.log(data)
  for (let i=0;i<5; i++){
      console.log(data.daily[i].dt)
      console.log(data.daily[i].temp.day)
      console.log(data.daily[i].wind_speed)
      console.log(data.daily[i].humidity)
    
        cardHTML.push(`
        <div class="card bg-dark text-white">
        <div class="card-title p-2"> </div>
        <div class="card-body">
            <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="mx-auto" >
            <div class="card-text"> Temp: ${data.daily[i].temp.day}</div>
            <div class="card-text"> Wind: ${data.daily[i].wind_speed} </div>
            <div class="card-text"> Humidity: ${data.daily[i].wind_speed} </div>
        </div>
    </div>`)
      } 
      document.querySelector(".card-deck").innerHTML = cardHTML.join('')
    
    }) 
  
}
 

// async function fetchWeather () {
//   const response = await fetch(
//     `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
//   )
//  const data = await response.json()
// console.log(data)
// }




// const weatherCardHTML = () => {
    
//   for (let i = 0; i < 5; i++) {
//     cardHTML.push(`
//     <div class="card bg-dark text-white">
//     <div class="card-title p-2"> data </div>
//     <div class="card-body">
//         <img src="http://openweathermap.org/img/wn/10d@2x.png" alt="weather icon" class="mx-auto" >
//         <div class="card-text"> Temp: </div>
//         <div class="card-text"> Wind: </div>
//         <div class="card-text"> Humidity </div>
//     </div>
// </div>`)
//   }
// }
fetchWeather(URL)
// weatherCardHTML()

document.querySelector(".card-deck").innerHTML = cardHTML
