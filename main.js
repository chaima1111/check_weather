const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const notFound = document.querySelector('.not-found ')
const searchCity = document.querySelector('.search-city ')
const weatherInfo = document.querySelector('.weather-info ')

const countryName = document.querySelector('.coutry-txt')
const tempText = document.querySelector(".temp-txt")
const condtionTxt = document.querySelector(".condition-txt")
const humdValue = document.querySelector(".humdity-value-txt")
const windValue = document.querySelector(".wind-value-txt")
const weatherImage = document.querySelector(".weather-summary-image")
const currDate = document.querySelector(".current-date-txt")

const forecastItems = document.querySelector(".forecast-items-container")


const apiKey = "8c6acb42602387a9d82ee222afc640b8"


searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && 
        cityInput.value.trim() != ''
    ) {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFecthData(endPoint ,city) {
    const apiUrl =`https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}
function getWetherIcon(id) {
    if (id <= 232) return 'thunderstorm.svg'
    if (id <= 321) return 'drizzle.svg'
    if (id <= 531) return 'rain.svg'
    if (id <= 622) return 'snow.svg'
    if (id <= 781) return 'atmosphere.svg'
    if (id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

function getCurrentDate() {
    const cDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month : 'short'
    }
    return cDate.toLocaleDateString('en-GB' , options)
}
async function updateWeatherInfo(city) {
    const weatherData = await getFecthData('weather', city)
    
    if (weatherData.cod != 200) {
        showDisplay(notFound)
        return
    }
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind : {speed}
    } = weatherData
    countryName.textContent = country;

    currDate.textContent = getCurrentDate()
    tempText.innerHTML = `${Math.round(temp)} &deg;C`
    condtionTxt.textContent = main
    humdValue.innerHTML = `${Math.round(humidity)} %`
    windValue.textContent = speed + 'M/s'
    weatherImage.src = `assets/weather/${getWetherIcon(id)}`
    
    await updateforecastInfo(city)
    
    showDisplay(weatherInfo)

}

async function updateforecastInfo(city) {
    const forecastsData = await getFecthData('forecast', city)
    console.log('forecastsData: ', forecastsData);
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    forecastItems.innerHTML =''
    forecastsData.list.forEach(forcastWeather => {
        if (forcastWeather.dt_txt.includes(timeTaken) && !forcastWeather.dt_txt.includes(todayDate)) {
            updateforecastItems(forcastWeather)
        }
        
    }  )

}

function updateforecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{
            id
        }],
        main : { temp}
    } = weatherData
    const dateTake = new Date(date)
        const dateOptions = {
        day: '2-digit',
        month : 'short'
    }
    const dateResult = dateTake.toLocaleDateString('en-US',dateOptions)
    const forecastItem = `
    <div class="forecast-item">
        <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
        <img src="assets/weather/${getWetherIcon(id)}" alt="" class="forecast-item-img">
        <h5 class="forecast-item-temp">${Math.round(temp)}&deg;C</h5>
    </div>
    `
    forecastItems.insertAdjacentHTML('beforeend', forecastItem)
}
function showDisplay(section) {
    [weatherInfo, searchCity, notFound] 
        .forEach(section => section.style.display = 'none')
    section.style.display='flex'
}