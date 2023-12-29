const weatherTab = document.querySelector("[yourWeather-tab]");
const searchTab = document.querySelector("[search-tab]");
const weatherContainer = document.querySelector('.weather-container');
const grantLocationContainer = document.querySelector('.grant-location-container');
const formContainer = document.querySelector('.form-container');
const loadingContainer = document.querySelector('.loading-container');
const searchBar = document.querySelector("[data-searchInput]");
const searchButton = document.querySelector('.search-btn');
const displayWeatherContainer = document.querySelector('.show-weather-container');


let currentTab = weatherTab;
const API_KEY = '38adb73c425d1de52e3b28d432897579';
currentTab.classList.add('current-tab');
getfromSessionStorage();
let city = "";

// first display the grant location container

// When Your Weather button is clicked
weatherTab.addEventListener('click',()=>{
    //pass clicked tab as input
    switchTab(weatherTab);
});

// When search weather button is clicked
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
})

// function to check which button is clicked
function switchTab(clickedTab){
    if(clickedTab != currentTab)
    {
        console.log(clickedTab);
        currentTab.classList.remove('current-tab');
        clickedTab.classList.add('current-tab');
        currentTab = clickedTab;

        if(!searchTab.classList.contains("active"))
        {
            console.log("search tab pe aaya");
            searchTab.classList.add('active');
            grantLocationContainer.classList.remove('active');
            displayWeatherContainer.classList.remove('active');
            formContainer.classList.add('active');
        }
        else{
            searchTab.classList.remove('active');
            console.log("your weather pe waps gaaya");
            formContainer.classList.remove('active');
            grantLocationContainer.classList.add('active');
            displayWeatherContainer.classList.remove('active');
            errorMessageContainer.classList.remove('active');
            getfromSessionStorage();
        }
    }
}

function getfromSessionStorage(){
    const localCoordinates = sessionStorage.getItem('user-coordinates');
    if(!localCoordinates){
        grantLocationContainer.classList.add('active');
    }
    else{
        //the coordinates {lat,longi} needs to be parse for Api call
        const coordinates = JSON.parse(localCoordinates);
        fetchUserWeatherInfoFromCoordinates(coordinates);
        grantLocationContainer.classList.remove('active');
    }
}

async function fetchUserWeatherInfoFromCoordinates(coordinates){
    const lat = coordinates.latitude;
    const longi = coordinates.longitude;
    //make grant location container invisible
    grantLocationContainer.classList.remove('active');
    loadingContainer.classList.add('active');
    
    //api call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${longi}&appid=${API_KEY}&units=metric`);
        if(response.ok){
            const data = await response.json();
            loadingContainer.classList.remove('active');
            displayWeatherContainer.classList.add('active');
            // console.log(data);
            renderWeatherInfo(data);
        }
        else{
            loadingContainer.classList.remove('active');
            grantLocationContainer.classList.add('active');
        }
    }
    catch(e){
        console.log("error"+e);
    }
}

// adding the weather details to the html elements
function renderWeatherInfo(data){
    let cityName = document.querySelector('[data-cityName]');
    let countryID = document.querySelector('[data-countryIcon]');
    let description = document.querySelector('[data-weather-desc]');
    let weatherIcon = document.querySelector('[data-weatherIcon]');
    let temperatureInfo = document.querySelector('[data-temperature]');
    let windSpeed = document.querySelector('[data-windSpeed]');
    let humidity = document.querySelector('[data-humidity]');
    let clouds = document.querySelector('[data-clouds]');

    cityName.innerText = data?.name;
    countryID.src = `https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    description.innerText = data?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    weatherIcon.width='100';
    temperatureInfo.innerText = data?.main?.temp.toFixed(2)+"°C";
    windSpeed.innerText = data?.wind?.speed +"m/s";
    humidity.innerText = data?.main?.humidity +"%";
    clouds.innerText = data?.clouds?.all +"%";

}

async function getMyLocation(){
    console.log("clicked");
    const myPromise = await new Promise((resolve,reject)=>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((position) => {
                let latitude = position.coords.latitude;
                let longitude = position.coords.longitude;
                let coords = {latitude,longitude};
                console.log(coords);
                sessionStorage.setItem('user-coordinates',JSON.stringify(coords));
                fetchUserWeatherInfoFromCoordinates(coords);
            },
            (error)=>{
                accessDenied();
            });
        }
        else{
            window.alert("Geolocation is not Supported by your browser");
            return;
        }
    });
    
}

const accessDenied = ()=>{
    let locationAccess = document.querySelector('[location-access]');
    locationAccess.textContent = "You denied the request for Geolocation."
}

let grantAccessButton = document.querySelector('.grant-access-btn');
grantAccessButton.addEventListener('click',getMyLocation);

let dataForm = document.querySelector('[data-form]');
dataForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    city = searchBar.value;
    console.log(city);

    if(city == "")
    return ;
else
    {
        searchBar.value="";
        fetchWeather(city);
    }
})

const errorMessageContainer = document.querySelector('[error-message]');

async function fetchWeather(city){
    loadingContainer.classList.add('active');
    displayWeatherContainer.classList.remove('active');
    errorMessageContainer.classList.remove('active');
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);

        if(response.ok){
            const data = await response.json();
            loadingContainer.classList.remove('active');
            displayWeatherContainer.classList.add('active');
            renderWeatherInfo(data);
        }
        else{
            console.log("Looks Like Wrong City Name");
            loadingContainer.classList.remove('active');
            errorMessageContainer.classList.add('active');
        }
    }
    catch(e){
        window.alert("Error");
    }
}
