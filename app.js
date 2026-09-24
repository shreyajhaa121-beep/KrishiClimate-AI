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
    
    // Save farmer profile
localStorage.setItem(
    "krishiClimateProfile",
    JSON.stringify({
        district: district,
        village: village,
        cropStage: cropStage,
        irrigation: irrigation,
        soil: soil
    })
);


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

// ------------------------------
// COMBINED CLIMATE RISK ENGINE
// ------------------------------

// 1. HIGH: Strong rainfall signal
if (
    (todayRainfall >= 20 && todayProbability >= 70) ||
    forecastHighRainRisk
) {
    riskLevel = "HIGH";

    if (soil === "clay") {
        riskReason =
            "High rainfall signal detected. Clay soil can retain more water, increasing the need to monitor drainage and waterlogging.";
    }
    else if (irrigation === "limited") {
        riskReason =
            "High rainfall signal detected while irrigation availability is limited. Monitor drainage and avoid unnecessary irrigation.";
    }
    else {
        riskReason =
            "High rainfall signal detected. Monitor the field for excess water and drainage conditions.";
    }
}

// 2. MODERATE: Water stress
else if (
    irrigation === "limited" &&
    todayRainfall < 5
) {
    riskLevel = "MODERATE";
    riskReason =
        "Limited irrigation availability combined with low rainfall may increase water stress.";
}

// 3. MODERATE: Rainfall during active crop stage
else if (
    (
        todayRainfall >= 10 &&
        todayProbability >= 60
    ) ||
    daily.precipitation_sum.some(function (rain, index) {
        return (
            rain >= 10 &&
            daily.precipitation_probability_max[index] >= 60
        );
    })
) {
    if (
        cropStage === "vegetative" ||
        cropStage === "flowering"
    ) {
        riskLevel = "MODERATE";
        riskReason =
            "Elevated rainfall signal detected during an active crop-growth stage. Monitor field moisture and drainage conditions.";
    }
    else {
        riskLevel = "MODERATE";
        riskReason =
            "Elevated rainfall signal detected. Monitor field moisture and drainage conditions.";
    }
}

// 4. MODERATE: Temperature stress
else if (
    todayTemperature >= 35 &&
    (
        cropStage === "vegetative" ||
        cropStage === "flowering"
    )
) {
    riskLevel = "MODERATE";
    riskReason =
        "Elevated temperature signal detected during an active crop-growth stage. Monitor crop and water conditions.";
}

// 5. LOW: No significant signal
else {
    riskLevel = "LOW";
    riskReason =
        "No major rainfall, temperature, or water-availability risk signal detected from the current inputs.";
}

        const riskLevelElement =
    document.getElementById("riskLevel");

const riskDescriptionElement =
    document.getElementById("riskReason");

        const riskSignalsElement =
    document.getElementById("riskSignals");

riskSignalsElement.innerHTML = "";

 if(todayRainfall >= 20) {
    riskSignalsElement.innerHTML +=
        "<li>🌧️ Today's forecast rainfall: " + todayRainfall + " mm</li>";
 }

if (todayProbability >= 60) {
    riskSignalsElement.innerHTML +=
        "<li>☔ Rain probability: " + todayProbability + "%</li>";
}

if (
    daily.precipitation_sum.some(function (rain) {
        return rain >= 20;
    })
) {
    riskSignalsElement.innerHTML +=
        "<li>📅 Heavy rainfall appears in the upcoming forecast</li>";
}
if (
    cropStage === "vegetative" ||
    cropStage === "flowering"
) {
    riskSignalsElement.innerHTML +=
        "<li>🌱 Active crop-growth stage: " + cropStage + "</li>";
}

if (soil === "clay") {
    riskSignalsElement.innerHTML +=
        "<li>🪨 Clay soil may retain more water</li>";
}

if (irrigation === "limited") {
    riskSignalsElement.innerHTML +=
        "<li>💧 Irrigation availability is limited</li>";
}

if (riskSignalsElement.innerHTML === "") {
    riskSignalsElement.innerHTML =
        "<li>✅ No major climate signal detected</li>";
}
riskLevelElement.textContent = riskLevel;

riskLevelElement.className =
    "risk-level " + riskLevel.toLowerCase();

riskDescriptionElement.textContent = riskReason;
 // ------------------------------
// DYNAMIC RECOMMENDED ACTION
// ------------------------------

const recommendedAction =
    document.getElementById("recommendedAction");

        const doNowAction =
    document.getElementById("doNowAction");

const monitorAction =
    document.getElementById("monitorAction");

const avoidAction =
    document.getElementById("avoidAction");

let actionText =
    "Monitor field conditions and upcoming weather before making irrigation decisions.";
        
if (riskLevel === "HIGH") {

    if (soil === "clay" && irrigation === "limited") {
        actionText =
            "Heavy rainfall is expected. Clay soil can retain more water, so check field drainage carefully, avoid unnecessary irrigation, and conserve available water.";
    }
    else if (soil === "clay") {
        actionText =
            "Heavy rainfall is expected. Clay soil can retain more water, so check field drainage before the rainfall period and monitor closely for waterlogging.";
    }
    else if (soil === "sandy" && irrigation === "rain-dependent") {
        actionText =
            "Heavy rainfall is expected. Monitor field moisture and drainage conditions, and avoid additional irrigation while rainfall is providing water to the crop.";
    }
    else if (soil === "sandy") {
        actionText =
            "Heavy rainfall is expected. Monitor field moisture and drainage conditions, as sandy soil can drain water more quickly.";
    }
    else if (soil === "loam") {
        actionText =
            "Heavy rainfall is expected. Monitor field moisture and drainage conditions and avoid unnecessary irrigation.";
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
            "Heavy rainfall is expected. Check field drainage before the rainfall period and avoid unnecessary irrigation while monitoring field moisture.";
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

        // Step 5K: Save complete analysis result
localStorage.setItem(
    "krishiClimateAnalysis",
    JSON.stringify({
        weatherLocation: weatherLocation.textContent,
        temperature: weatherTemperature.textContent,
        rainfall: weatherRainfall.textContent,
        probability: weatherProbability.textContent,
        forecast: weatherForecast.textContent,
        riskLevel: riskLevelElement.textContent,
        riskReason: riskDescriptionElement.textContent,
        riskSignals: riskSignalsElement.innerHTML,
        recommendedAction: recommendedAction.textContent,
        doNow: doNowAction.textContent,
        monitor: monitorAction.textContent,
        avoid: avoidAction.textContent
    })
);

        // Step 5J: Action Priority
let doNowText =
    "Check the field condition and follow the latest weather signal.";

let monitorText =
    "Monitor rainfall, soil moisture, and crop condition.";

let avoidText =
    "Avoid unnecessary irrigation or other actions when the field already has sufficient moisture.";

if (riskLevel === "HIGH") {

    doNowText =
        "Check field drainage and prepare for the expected heavy rainfall.";

    monitorText =
        "Monitor field moisture, standing water, and crop condition closely.";

    avoidText =
        "Avoid unnecessary irrigation while heavy rainfall is expected.";

}
else if (riskLevel === "MODERATE") {

    doNowText =
        "Check the field condition and review the upcoming rainfall signal before making irrigation decisions.";

    monitorText =
        "Monitor soil moisture, rainfall, and crop condition.";

    avoidText =
        "Avoid unnecessary irrigation when sufficient moisture is already available.";

}
else {

    doNowText =
        "Continue normal field monitoring and check the upcoming weather forecast.";

    monitorText =
        "Monitor rainfall, soil moisture, and crop condition.";

    avoidText =
        "Avoid making irrigation decisions without checking current field conditions and rainfall forecasts.";

}

doNowAction.textContent = doNowText;
monitorAction.textContent = monitorText;
avoidAction.textContent = avoidText;

        // Step 5K: Farmer Action Tracker

const actionDrainage =
    document.getElementById("actionDrainage");

const actionMoisture =
    document.getElementById("actionMoisture");

const actionIrrigation =
    document.getElementById("actionIrrigation");

const actionProgress =
    document.getElementById("actionProgress");

function updateActionProgress() {

    let completed = 0;

    if (actionDrainage.checked) {
        completed++;
    }

    if (actionMoisture.checked) {
        completed++;
    }

    if (actionIrrigation.checked) {
        completed++;
    }

    actionProgress.textContent =
        completed + "/3 actions completed";
}

actionDrainage.addEventListener(
    "change",
    updateActionProgress
);

actionMoisture.addEventListener(
    "change",
    updateActionProgress
);

actionIrrigation.addEventListener(
    "change",
    updateActionProgress
);

        // Save action progress
function saveActionProgress() {
    localStorage.setItem(
        "krishiClimateActions",
        JSON.stringify({
            drainage: actionDrainage.checked,
            moisture: actionMoisture.checked,
            irrigation: actionIrrigation.checked
        })
    );
}

// Load saved action progress
function loadActionProgress() {

    const savedActions =
        localStorage.getItem("krishiClimateActions");

    if (!savedActions) {
        return;
    }

    const actions = JSON.parse(savedActions);

    actionDrainage.checked = actions.drainage;
    actionMoisture.checked = actions.moisture;
    actionIrrigation.checked = actions.irrigation;

    updateActionProgress();
}

actionDrainage.addEventListener(
    "change",
    saveActionProgress
);

actionMoisture.addEventListener(
    "change",
    saveActionProgress
);

actionIrrigation.addEventListener(
    "change",
    saveActionProgress
);

loadActionProgress();
        

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


// Restore saved farmer profile
const savedProfile =
    localStorage.getItem("krishiClimateProfile");

if (savedProfile) {

    const profile = JSON.parse(savedProfile);

    document.getElementById("district").value =
        profile.district || "";

    document.getElementById("village").value =
        profile.village || "";

    document.getElementById("cropStage").value =
        profile.cropStage || "";

    document.getElementById("irrigation").value =
        profile.irrigation || "";

    document.getElementById("soil").value =
        profile.soil || "";
}

// Restore saved analysis
const savedAnalysis =
    localStorage.getItem("krishiClimateAnalysis");

if (savedAnalysis) {

    const analysis = JSON.parse(savedAnalysis);

    weatherLocation.textContent =
        analysis.weatherLocation || "Unavailable";

    weatherTemperature.textContent =
        analysis.temperature || "Unavailable";

    weatherRainfall.textContent =
        analysis.rainfall || "Unavailable";

    weatherProbability.textContent =
        analysis.probability || "Unavailable";

    weatherForecast.textContent =
        analysis.forecast || "Unavailable";

    riskLevelElement.textContent =
        analysis.riskLevel || "LOW";

    riskLevelElement.className =
        "risk-level " +
        (analysis.riskLevel || "LOW").toLowerCase();

    riskDescriptionElement.textContent =
        analysis.riskReason || "";

    riskSignalsElement.innerHTML =
        analysis.riskSignals ||
        "<li>✅ No major climate signal detected</li>";

    recommendedAction.textContent =
        analysis.recommendedAction || "";

    doNowAction.textContent =
        analysis.doNow || "";

    monitorAction.textContent =
        analysis.monitor || "";

    avoidAction.textContent =
        analysis.avoid || "";
}

// Step 5K: Open saved analysis after refresh
window.addEventListener("load", function () {

    const savedSession =
        localStorage.getItem("krishiClimateAnalysis");

    if (savedSession) {

        landingPage.style.display = "none";
        profilePage.style.display = "none";
        analysisPage.style.display = "block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }
});
