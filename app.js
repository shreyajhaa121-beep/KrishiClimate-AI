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


// Analyze Farmer Profile
analyzeButton.addEventListener("click", async function () {

    const district = document.getElementById("district").value;
    const village = document.getElementById("village").value;
    const crop = document.getElementById("crop").value;
    const cropStage = document.getElementById("cropStage").value;
    const irrigation = document.getElementById("irrigation").value;
    const soil = document.getElementById("soil").value;

    // Find weather location coordinates
const locationQuery = village + ", " + district + ", Bihar";

const geoResponse = await fetch(
    "https://geocoding-api.open-meteo.com/v1/search?name=" +
    encodeURIComponent(locationQuery) +
    "&count=5&language=en&format=json&countryCode=IN"
);

const geoData = await geoResponse.json();

if (!geoData.results || geoData.results.length === 0) {
    document.getElementById("weatherLocation").textContent =
        "Location not found";

    return;
}

const location = geoData.results[0];

document.getElementById("weatherLocation").textContent =
    location.name + ", " + location.admin1;

    resultLocation.textContent = district + ", " + village;
    resultCrop.textContent = "Rice";
    resultStage.textContent = cropStage;
    resultIrrigation.textContent = irrigation;
    resultSoil.textContent = soil || "Not provided";

    profilePage.style.display = "none";
    analysisPage.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});
