
console.log("Firebase script loaded!");

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyC7lBEXdzmLYRiWQV8OBr1HzQv_wsMY5rE",
    authDomain: "aqi-tracker-8cfa9.firebaseapp.com",
    databaseURL: "https://aqi-tracker-8cfa9-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "aqi-tracker-8cfa9",
    storageBucket: "aqi-tracker-8cfa9.appspot.com",
    messagingSenderId: "536444195734",
    appId: "1:536444195734:web:bc71104de1c34c705883b7"
};


const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function updateUI(snapshot) {
    if (snapshot.exists()) {
        let data = snapshot.val();
        let aqiElement = document.getElementById("aqi-value");
        let tempElement = document.getElementById("temperature-value");
        let humidityElement = document.getElementById("humidity-value");

        
        if (!aqiElement || !tempElement || !humidityElement) {
            console.error("One or more elements not found!");
            return;
        }

        animateCount(aqiElement, parseInt(aqiElement.textContent) || 0, data.aqi, 1000);
        animateCount(tempElement, parseFloat(tempElement.textContent) || 0, data.temperature, 1000, "°C");
        animateCount(humidityElement, parseInt(humidityElement.textContent) || 0, data.humidity, 1000, "%");
    } else {
        console.log("No data found!");
    }
}


function animateCount(element, start, end, duration, unit = "") {
    let range = end - start;
    let startTime = null;

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        let progress = (timestamp - startTime) / duration;
        
        let value = unit === "°C" ? (start + range * progress).toFixed(1) : Math.floor(start + range * progress);
        
        element.textContent = value + unit;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = end + unit; 
        }
    }

    requestAnimationFrame(step);
}

window.onload = function () {
    const startButton = document.getElementById("btn");
    let monitoringStarted = false; 

    if (startButton) {
        startButton.addEventListener("click", function () {
            if (monitoringStarted) return;
            monitoringStarted = true;

            console.log("Monitoring started...");
            startButton.style.display = "none";

           
            document.querySelectorAll(".card").forEach(element => {
                element.style.display = "flex";
            });

            const sensorRef = ref(database, "/sensor");
            onValue(sensorRef, (snapshot) => {
                updateUI(snapshot);
            });
        });
    } else {
        console.error("Start Monitoring button not found!");
    }
};
