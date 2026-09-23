const startButton = document.getElementById("startButton");

const landingPage = document.getElementById("landingPage");
const profilePage = document.getElementById("profilePage");


// Open Farmer Profile
startButton.addEventListener("click", function () {

    landingPage.style.display = "none";
    profilePage.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


const analyzeButton = document.getElementById("analyzeButton");

const analysisPage = document.getElementById("analysisPage");

const resultLocation = document.getElementById("resultLocation");
const resultCrop = document.getElementById("resultCrop");
const resultStage = document.getElementById("resultStage");
const resultIrrigation = document.getElementById("resultIrrigation");
const resultSoil = document.getElementById("resultSoil");

const weatherLocation = document.getElementById("weatherLocation");

const weatherTemperature =
    document.getElementById("weatherTemperature");

const weatherRainfall =
    document.getElementById("weatherRainfall");

const weatherProbability =
    document.getElementById("weatherProbability");

const weatherForecast =
    document.getElementById("weatherForecast");


// Analyze Farmer Profile
analyzeButton.addEventListener("click", async function () {

    const district =
        document.getElementById("district").value;

    const village =
        document.getElementById("village").value;

    const cropStage =
        document.getElementById("cropStage").value;

    const irrigation =
        document.getElementById("irrigation").value;

    const soil =
        document.getElementById("soil").value;


    // Show farmer information
    resultLocation.textContent =
        district + ", " + village;

    resultCrop.textContent = "Rice";

    resultStage.textContent =
        cropStage;

    resultIrrigation.textContent =
        irrigation;

    resultSoil.textContent =
        soil || "Not provided";


    // Open Analysis Page
    profilePage.style.display = "none";
    analysisPage.style.display = "block";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    // Loading states
    weatherLocation.textContent =
        "Finding location...";

    weatherTemperature.textContent =
        "Loading...";

    weatherRainfall.textContent =
        "Loading...";

    weatherProbability.textContent =
        "Loading...";

    weatherForecast.textContent =
        "Loading...";


    try {

        // --------------------------------
        // STEP 1: FIND LOCATION
        // --------------------------------

        const locationQuery =
            district + ", Bihar";


        const geoResponse = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(locationQuery) +
            "&count=5&language=en&format=json&countryCode=IN"
        );


        if (!geoResponse.ok) {
            throw new Error("Location request failed");
        }


        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            weatherLocation.textContent =
                "Location not found";

            weatherTemperature.textContent =
                "Unavailable";

            weatherRainfall.textContent =
                "Unavailable";

            weatherProbability.textContent =
                "Unavailable";

            weatherForecast.textContent =
                "Unavailable";

            return;
        }


        const location =
            geoData.results[0];


        weatherLocation.textContent =
            location.name + ", " + location.admin1;


        // Coordinates
        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        console.log(
            "Weather coordinates:",
            latitude,
            longitude
        );


        // --------------------------------
        // STEP 2: GET WEATHER
        // --------------------------------

        const weatherURL =
            "https://api.open-meteo.com/v1/forecast" +
            "?latitude=" + latitude +
            "&longitude=" + longitude +
            "&daily=" +
            "temperature_2m_max," +
            "precipitation_sum," +
            "precipitation_probability_max" +
            "&forecast_days=3" +
            "&timezone=auto";


        const weatherResponse =
            await fetch(weatherURL);


        if (!weatherResponse.ok) {
            throw new Error("Weather request failed");
        }


        const weatherData =
            await weatherResponse.json();


        const daily =
            weatherData.daily;


        // --------------------------------
        // STEP 3: DISPLAY WEATHER
        // --------------------------------

        const todayTemperature =
            daily.temperature_2m_max[0];

        const todayRainfall =
            daily.precipitation_sum[0];

        const todayProbability =
            daily.precipitation_probability_max[0];

        const forecastHighRainRisk =
    daily.precipitation_sum.some(function (rain, index) {
        return (
            rain >= 20 &&
            daily.precipitation_probability_max[index] >= 70
        );
    });
        
 // ------------------------------
// DYNAMIC CLIMATE RISK ENGINE
// ------------------------------

let riskLevel = "LOW";
let riskReason = "No major climate signal detected.";

        if (
    (todayRainfall >= 20 && todayProbability >= 70) ||
    forecastHighRainRisk
) {
    riskLevel = "HIGH";
    riskReason =
        "High rainfall signal detected. Monitor the field for excess water and drainage conditions.";
}
            else if (
    (
        todayRainfall >= 10 &&
        todayProbability >= 60
    ) ||
    (
        daily.precipitation_sum.some(function (rain, index) {
            return (
                rain >= 10 &&
                daily.precipitation_probability_max[index] >= 60
            );
        })
    )
    &&
    (cropStage === "vegetative" || cropStage === "flowering")
) {
    riskLevel = "MODERATE";
    riskReason =
        "Elevated rainfall signal detected during an active crop-growth stage. Monitor field moisture and drainage conditions.";
            }
else if (
    todayRainfall >= 10 &&
    todayProbability >= 60 &&
    (cropStage === "vegetative" || cropStage === "flowering")
) {
    riskLevel = "MODERATE";
    riskReason =
        "Elevated rainfall signal during an active crop-growth stage. Monitor field moisture and drainage conditions.";
}
else if (irrigation === "limited" && todayRainfall < 5) {
    riskLevel = "MODERATE";
    riskReason =
        "Limited irrigation availability combined with low rainfall may increase water stress.";
}
else if (
    todayTemperature >= 35 &&
    (cropStage === "vegetative" || cropStage === "flowering")
) {
    riskLevel = "MODERATE";
    riskReason =
        "Elevated temperature signal detected during an active crop-growth stage. Monitor crop and water conditions.";
}
else {
    riskLevel = "LOW";
    riskReason =
        "No major rainfall, temperature, or water-availability risk signal detected from the current inputs.";
}
        const riskLevelElement =
    document.getElementById("riskLevel");

const riskDescriptionElement =
    document.getElementById("riskReason");
riskLevelElement.textContent = riskLevel;

riskLevelElement.className =
    "risk-level " + riskLevel.toLowerCase();

riskDescriptionElement.textContent = riskReason;
 // ------------------------------
// DYNAMIC RECOMMENDED ACTION
// ------------------------------

const recommendedAction =
    document.getElementById("recommendedAction");

let actionText =
    "Monitor field conditions and upcoming weather before making irrigation decisions.";
        
if (riskLevel === "HIGH") {

    if (irrigation === "limited") {
        actionText =
            "Heavy rainfall is expected. Check field drainage and avoid unnecessary irrigation. Conserve available water and monitor the field for waterlogging.";
    }
    else if (irrigation === "rain-dependent") {
        actionText =
            "Heavy rainfall is expected. Monitor field drainage and avoid additional irrigation while rainfall is providing water to the crop.";
    }
    else if (cropStage === "flowering") {
        actionText =
            "Heavy rainfall is expected during the flowering stage. Check field drainage before the rainfall period and monitor the crop closely for excess moisture.";
    }
    else if (cropStage === "vegetative") {
        actionText =
            "Heavy rainfall is expected during the vegetative stage. Check field drainage before the rainfall period and avoid unnecessary irrigation if the field is already adequately moist.";
    }
    else {
        actionText =
            "Heavy rainfall is expected. Check field drainage before the rainfall period and avoid unnecessary irrigation if the field is already adequately moist.";
    }

}

else if (riskLevel === "MODERATE" && todayRainfall >= 10) {
    actionText =
        "Rainfall signal is elevated. Monitor field moisture and drainage conditions before adding irrigation.";
}
else if (riskLevel === "MODERATE" && irrigation === "limited") {
    actionText =
        "Irrigation availability is limited. Monitor soil moisture and upcoming rainfall before deciding whether irrigation is needed.";
}

recommendedAction.textContent = actionText;


        weatherTemperature.textContent =
            todayTemperature + " °C";


        weatherRainfall.textContent =
            todayRainfall + " mm";


        weatherProbability.textContent =
            todayProbability + "%";


        // Three-day forecast
        const forecastText =
            daily.time
                .map(function (date, index) {

                    return (
                        date +
                        ": " +
                        daily.temperature_2m_max[index] +
                        "°C, " +
                        daily.precipitation_sum[index] +
                        " mm rain"
                    );

                })
                .join(" | ");


        weatherForecast.textContent =
            forecastText;


    } catch (error) {

        console.error(
            "Weather error:",
            error
        );


        weatherTemperature.textContent =
            "Unavailable";

        weatherRainfall.textContent =
            "Unavailable";

        weatherProbability.textContent =
            "Unavailable";

        weatherForecast.textContent =
            "Weather data unavailable";

    }

});
