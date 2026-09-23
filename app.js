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


// Analyze Farmer Profile
analyzeButton.addEventListener("click", async function () {

    const district = document.getElementById("district").value;
    const village = document.getElementById("village").value;
    const crop = document.getElementById("crop").value;
    const cropStage = document.getElementById("cropStage").value;
    const irrigation = document.getElementById("irrigation").value;
    const soil = document.getElementById("soil").value;


    // Show farmer information
    resultLocation.textContent = district + ", " + village;
    resultCrop.textContent = "Rice";
    resultStage.textContent = cropStage;
    resultIrrigation.textContent = irrigation;
    resultSoil.textContent = soil || "Not provided";


    // Find weather location coordinates
    weatherLocation.textContent = "Finding location...";

    try {

        const locationQuery = district + ", Bihar";

        const geoResponse = await fetch(
            "https://geocoding-api.open-meteo.com/v1/search?name=" +
            encodeURIComponent(locationQuery) +
            "&count=5&language=en&format=json&countryCode=IN"
        );

        const geoData = await geoResponse.json();


        if (!geoData.results || geoData.results.length === 0) {

            weatherLocation.textContent =
                "Location not found";

            return;
        }


        const location = geoData.results[0];


        weatherLocation.textContent =
            location.name + ", " + location.admin1;


        // Save coordinates for the weather step
        const latitude = location.latitude;
        const longitude = location.longitude;

        console.log("Weather coordinates:", latitude, longitude);


        // Open Analysis Page
        profilePage.style.display = "none";
        analysisPage.style.display = "block";

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    } catch (error) {

        weatherLocation.textContent =
            "Unable to find weather location";

        console.error("Geocoding error:", error);

    }

});
