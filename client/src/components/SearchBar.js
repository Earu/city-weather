import React from "react";
import "./SearchBar.css";

class SearchBar extends React.Component {
	onSearchInput(ev) {
		if (ev.which !== 13) return;
		this.props.onSearch();
	}

	onSearchClick() {
		this.props.onSearch();
	}

	render() {
		return (<div className="search-bar">
			<input input="text" id="citySearch" placeholder="Type a city name..." onKeyDown={this.onSearchInput.bind(this)}/>
			<button onClick={this.onSearchClick.bind(this)}>Search</button>
		</div>);
	}
}

export default SearchBar;