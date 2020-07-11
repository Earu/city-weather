import React from "react";
import { Notyf } from "notyf";
import "./App.css"

import CityWeather from "./CityWeather";
import SearchBar from "./SearchBar";

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { cities: [] };
		this.cityCache = [];
		this.notifications = new Notyf({
			duration: 5000,
			ripple: true,
		});
	}

	setCookie(cookieName, cookieValue, daysToExpiration) {
		const date = new Date();
		date.setTime(date.getTime() + (daysToExpiration * 24 * 60 * 60 * 1000));
		const expires = `expires=${date.toUTCString()}`;
		document.cookie = `${cookieName}=${cookieValue};${expires};path=/`;
	}

	getCookie(cookieName) {
		const decodedCookie = decodeURIComponent(document.cookie);
		const value = decodedCookie.split(";")[0];

		return value.replace(`${cookieName}=`, "");
	}

	async requestCityWeather(cityName) {
		cityName = cityName.trim();
		if (cityName.length === 0) return null;

		const response = await fetch(`./weather/${encodeURIComponent(cityName)}`);
		if (response.ok) {
			const weatherData = await response.json();
			if (weatherData.cod === 200) { // make sure the API returns a valid response
				return weatherData;
			} else {
				this.notifications.error(weatherData.message);
			}
		} else {
			this.notifications.error(`${response.status}: ${response.body}`);
		}

		return null;
	}

	async componentDidMount() {
		const cityNames = this.getCookie("weatherCities").split("|");
		for(const cityName of cityNames) {
			const cityWeatherData = await this.requestCityWeather(cityName);
			this.cityCache[cityName] = cityWeatherData;
		}

		this.setState({ cities: cityNames });
	}

	async processCityWeather() {
		const input = document.getElementById("citySearch");
		if (!input) return;

		const cityName = input.value;
		if (!this.cityCache[cityName]) {
			const cityWeatherData = await this.requestCityWeather(cityName);
			this.cityCache[cityName] = cityWeatherData;
		}

		if (!this.state.cities.includes(cityName)) {
			this.state.cities.push(cityName);
			this.setCookie("weatherCities", this.state.cities.join("|"), 2);
			this.setState({ cities: this.state.cities }); // let react know it should process our cities
		}

		input.value = "";
	}

	render() {
		return (<div>
			<header>City Weather 🌇</header>
			<SearchBar onSearch={this.processCityWeather.bind(this)}/>
			<div>{
				this.state.cities
					.filter(cityName => this.cityCache[cityName]) // check that we have cached data for that, if not dont display it
					.map(cityName => <CityWeather data={this.cityCache[cityName]}/>)
			}</div>
		</div>);
	}
}

export default App;