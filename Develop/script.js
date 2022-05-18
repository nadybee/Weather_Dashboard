const now = new Date($.now())
const todayDate = moment(now).format("dddd, MMMM Do, h:mm a z")
const currentHour = moment(now).format("H")

console.log(todayDate)
let apiKey = ``
let lat =40.2338
let lon=-111.6585
let city= "Provo, UT"

function findLocation () {
    $("#city-buttons").click(event =>{
        if (event.target.id==='austin'){
            city = "Austin"
            lat = 30.2672
            lon= -97.7431
        }

    })
}

// const URL = `https://api.openweathermap.org/data/2.5/onecall/zip?zio&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
const URL=   `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${apiKey}&units=imperial`
let cardHTML = []
let jumbotronHTML;
let timezone;

const fetchWeather=(URL) => {
 
fetch(URL)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    // jumbotronHTML=`<h3 class="text-dark> ${city} (${data.current.dt})</h3> <h4> Temp:${data.current.temp}°</h4> <h4> Wind:  </h4>`

    $("#city-buttons").click(event =>{
        if (event.target.id==='austin'){
            city = "Austin"
            lat = 30.2672
            lon= -97.7431
            console.log('austin')
        }

    })
      console.log(data)

  for (let i=0;i<5; i++){
    
        cardHTML.push(`
        <div class="card text-white background">
        <div class="card-title p-2"> ${data.daily[i].dt} </div>
        <div class="card-body">
            <img src="http://openweathermap.org/img/wn/${data.daily[i].weather[0].icon}@2x.png" alt="weather icon" class="mx-auto" >
            <div class="card-text"> Temp: ${Math.round(data.daily[i].temp.day)}°</div>
            <div class="card-text"> Wind: ${Math.round(data.daily[i].wind_speed)} mph</div>
            <div class="card-text"> Humid: ${data.daily[i].humidity}%</div>
        </div>
    </div>`)
      } 
      document.querySelector(".card-deck").innerHTML = cardHTML.join('')
      document.getElementById('jumbotron').innerHTML = jumbotronHTML

    }) 

}
fetchWeather(URL)

