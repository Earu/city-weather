import React from "react";
import { Notyf } from "notyf";
import CityWeather from "./CityWeather";
import "./App.css"

class App extends React.Component {
	notifications = new Notyf({
		duration: 5000,
		ripple: true,
	});

	async requestCityWeather() {
		const input = document.getElementById("citySearch");
		const list = document.getElementById("searchResults");
		if (!input || !list) return;

		const response = await fetch(`./weather/${input.value}`);
		if (response.ok) {
			const weatherData = await response.json();
			if (weatherData.cod === 200) { // make sure the API returns a valid response
				/*
				TODO:
				Maintain a list of cities with cookies (?) and use that to build the list of city weather elements?

				const weatherJsx = <CityWeather/>;
				list.appendChild(weatherJsx);
				*/
			} else {
				this.notifications.error(weatherData.message);
			}
		} else {
			this.notifications.error(`${response.status}: ${response.body}`);
		}

		input.value = "";
	}

	onSearchInput(ev) {
		if (ev.which !== 13) return;
		this.requestCityWeather();
	}

	onSearchClick() {
		this.requestCityWeather();
	}

	render() {
		return (<div>
			<header>City Weather 🌇</header>
			<div className="search-bar">
				<input input="text" id="citySearch" placeholder="Type a city name..." onKeyDown={this.onSearchInput.bind(this)}/>
				<button onClick={this.onSearchClick.bind(this)}>Search</button>
			</div>
			<div id="searchResults" />
		</div>);
	}
}

export default App;