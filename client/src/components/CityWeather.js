import React from "react";
import "./CityWeather.css";

class CityWeather extends React.Component {
	constructor(props) {
		super(props);
		console.log(props.data);
	}

	kelvinToCelsius(kelvin) {
		return Math.round(kelvin - 273.1);
	}

	kelvinToFahrenheit(kelvin) {
		return Math.round(kelvin * 9 / 5 - 459.67);
	}

	unixTimeToDate(unixTime) {
		const date = new Date(unixTime * 1000);
		const hours = date.getHours();
		const minutes = "0" + date.getMinutes();
		return `${hours}:${minutes.substr(-2)}`;
	}

	render() {
		return (<div className="city-weather">
			<div className="city-name">{this.props.data.name} ({this.props.data.sys.country})</div>
			{
				this.props.data.weather[0]
				? <div>
					<img width="64px" src={"https://openweathermap.org/img/wn/" + this.props.data.weather[0].icon + "@2x.png"}/>
					<div>Weather: {this.props.data.weather[0].description}</div>
				</div>
				: <div/>
			}
			<div>Temperature: {this.kelvinToCelsius(this.props.data.main.temp)}°C | {this.kelvinToFahrenheit(this.props.data.main.temp)}°F</div>
			<div>Humidity: {this.props.data.main.humidity}%</div>
			<div>Sunrise: {this.unixTimeToDate(this.props.data.sys.sunrise + this.props.data.timezone)}</div>
			<div>Sunset: {this.unixTimeToDate(this.props.data.sys.sunset + this.props.data.timezone)}</div>
			<button className="city-close">X</button>
			<div className="city-last-update">Last updated at: {this.unixTimeToDate(this.props.data.dt)}</div>
		</div>);
	}
}

export default CityWeather;