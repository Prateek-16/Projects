const userTab = document.querySelector("[data-userWeather]");
const SearchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

//initially variables needed
let currentTab = userTab;
const API_KEY = "168771779c71f3d64106d8a88376808a";

currentTab.classList.add("current-tab");
getfromSessionStorage();

function switchTab(clickedTab){
    if(clickedTab != currentTab){
        currentTab.classList.remove("current-tab");
        currentTab = clickedTab;
        currentTab.classList.add("current-tab");

        if(!searchForm.classList.contains("active")){
            //your weather to search
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //search to your weather
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getfromSessionStorage();   
        }
    }
}

userTab.addEventListener("click", () => {
    switchTab(userTab);
});

SearchTab.addEventListener("click", () => {
    switchTab(SearchTab);
});

//check if cooridinates are already in session storage
function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active"); 
    }
    else{
        const cooridinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfo(cooridinates);
    }
}

async function fetchUserWeatherInfo(cooridinates){
    const {lat,lon} = cooridinates;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");

    //API CALL
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
        const data = await response.JSON();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(e){
        loadingScreen.classList.remove("active");
    }

};

function renderWeatherInfo(weatherInfo){
    //firstly we have to fetch the elements

    const cityName = document.querySelector("[data-cityName]");
    const countryIcon = document.querySelector("[data-countryIcon]");
    const desc = document.querySelector("[data-weatherDesc]");
    const weatherIcon = document.querySelector("[data-weatherIcon]");
    const temp = document.querySelector("[data-temp]");
    const windspeed = document.querySelector("[data-windspeed]");
    const humidity = document.querySelector("[data-humidity]");
    const clouds = document.querySelector("[data-cloudiness]");

    cityName.innerText = weatherInfo?.name;
    countryFlag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    description.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp.toFixed(2)} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed.toFixed(2)} m/s`;
    humidity.innerText = `${weatherInfo?.main?.humidity.toFixed(2)} %`;
    clouds.innerText = `${weatherInfo?.clouds?.all.toFixed(2)} %`;

};

function getLocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }   
    else{
        //HW - Show an alert for no geo Location
    }
};

function showPosition(position){
    const userCoordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
    }
    sessionStorage.setItem("userCoordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);

};

const grantAccessButton = document.querySelector("[data-grantAccess]"); 
grantAccessButton.addEventListener("click",getLocation);

let searchInput = document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit",(e) =>{
    e.preventDefault();
    if(searchInput.value ==="") return ;
    fetchSearchWeatherInfo(searchInput.value);
});

async function fetchSearchWeatherInfo(city) {
    loadingContainer.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    notFound.classList.remove("active");
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        const data = await response.JSON();
        if (!data.sys) {
            throw data;
        }
        loadingContainer.classList.remove('active');
        userInfoContainer.classList.add('active');
        renderWeatherInfo(data);
    }
    catch (err) {
    }
};