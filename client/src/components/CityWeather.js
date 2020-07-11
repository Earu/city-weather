import React from "react";
import "./CityWeather.css";

class CityWeather extends React.Component {
	constructor(props) {
		super(props);
		console.log(props.data);
	}

	render() {
		return (<div className="city-weather">
			<div className="city-name">{this.props.data.name} ({this.props.data.sys.country})</div>
			<div>{this.props.data.weather[0] ? this.props.data.weather[0].description : "unknown"}</div>
		</div>);
	}
}

export default CityWeather;