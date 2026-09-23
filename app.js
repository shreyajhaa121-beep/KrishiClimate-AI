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
analyzeButton.addEventListener("click", function () {

    const district = document.getElementById("district").value;
    const village = document.getElementById("village").value;
    const crop = document.getElementById("crop").value;
    const cropStage = document.getElementById("cropStage").value;
    const irrigation = document.getElementById("irrigation").value;
    const soil = document.getElementById("soil").value;

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
