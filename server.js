const https = require("https");
const fs = require("fs");
const express = require("express");

const SERVER_PORT = 6009;
const HTTP_SERVER = express();
const API_ENDPOINT = "https://api.openweathermap.org/data/2.5/weather";

HTTP_SERVER.use(express.static("./client/build/"));
HTTP_SERVER.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}`));

let apiToken = null;
async function initializeApiToken() {
	return new Promise((resolve, reject) => {
		fs.readFile("./token.txt", "utf8", (err, data) => {
			if (err) {
				reject("No API token found!");
			}

			apiToken = data;
			console.log("Token set! Ready to get weather data!");
			resolve();
		});
	})
}

async function requestCityWeather(cityName) {
	if (apiToken == null) {
		await initializeApiToken();
	}

	return new Promise((resolve, reject) => {
		const targetUrl = `${API_ENDPOINT}?q=${encodeURIComponent(cityName)}&appid=${apiToken}`;
		https.get(targetUrl, (response) => {
			let rawData = "";
			response.on("data", (chunk) => rawData += chunk);
			response.on("end", () => resolve(rawData));
		}).on("error", reject);
	});
}

HTTP_SERVER.get("/weather/:city", async (request, result) => {
	const cityName = request.params["city"];
	if (!cityName) {
		result.status(400);
		return result.send("No city name specified.");
	}

	try {
		const weatherData = await requestCityWeather(cityName);
		result.status(200);
		result.setHeader("Content-Type", "application/json");
		return result.send(weatherData);
	} catch (err) {
		result.status(500);
		return result.send(err);
	}
});