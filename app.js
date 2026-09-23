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


// Analyze Farmer Profile
analyzeButton.addEventListener("click", function () {

    alert(
        "Farm profile received successfully! 🌾\n\n" +
        "Next: KrishiClimate AI will analyze climate and crop risks."
    );

});
