import React from 'react';
import './App.css';

let apiKey = "b949a98c4939fc9af1f13538f5467c2a";
let city = "portsmouth, uk";
let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            days: [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday"
            ],
            result: []
        };
    }
    componentDidMount() {
        fetch(url)
            .then(res => res.json())
            .then(
                result => {
                    this.setState({
                        isLoaded: true,
                        result: result
                    });
                },
                error => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    handleClick(e) {
        e.preventDefault();
        let test = document.querySelectorAll(".weather__item.active");
        [].forEach.call(test, function(el) {
            el.classList.remove("active");
        });

        e.currentTarget.classList.toggle("active");
    }

    getWindDirection(degree) {
        const degreePerDirection = 360 / 8;
        const offsetAngle = degree + degreePerDirection / 2;

        return offsetAngle >= 0 * degreePerDirection &&
        offsetAngle < 1 * degreePerDirection
            ? "N"
            : offsetAngle >= 1 * degreePerDirection &&
            offsetAngle < 2 * degreePerDirection
                ? "NE"
                : offsetAngle >= 2 * degreePerDirection &&
                offsetAngle < 3 * degreePerDirection
                    ? "E"
                    : offsetAngle >= 3 * degreePerDirection &&
                    offsetAngle < 4 * degreePerDirection
                        ? "SE"
                        : offsetAngle >= 4 * degreePerDirection &&
                        offsetAngle < 5 * degreePerDirection
                            ? "S"
                            : offsetAngle >= 5 * degreePerDirection &&
                            offsetAngle < 6 * degreePerDirection
                                ? "SW"
                                : offsetAngle >= 6 * degreePerDirection &&
                                offsetAngle < 7 * degreePerDirection
                                    ? "W"
                                    : "NW";
    }

    renderItem(item, index) {
        console.log(item);
        let temp = item.main.temp - 273.15;
        temp = Math.round(temp * 100 / 100);
        let date = new Date(item.dt_txt);
        let day = date.getDay();
        let windDirection = this.getWindDirection(item.wind.deg);
        let windSpeed = Math.round((item.wind.speed * 2.2369362920544) * 100/ 100);

        return (
            <li
                className={"weather__item " + (index === 0 ? "active" : false)}
                onClick={this.handleClick}
            >
                <div className="weather__icon">
                    <i className={`wi icon-${item.weather[0].icon}`} />
                </div>
                <div className="weather__details">
                    <div className="weather__day">{this.state.days[day]}</div>
                    <div className="weather__info">
                        <div className="weather__temp">{temp}&deg;C</div>
                        <div className="weather__text">{item.weather[0].main}</div>
                        <div className="weather__text">
                            Wind: {windDirection} {windSpeed}mph
                        </div>
                        <div className="weather__text">
                            Humidity: {item.main.humidity}%
                        </div>
                    </div>
                </div>
            </li>
        );
    }

    render() {
        const { error, isLoaded, result } = this.state;
        const items = result.list;
        // console.log(items);

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            let filteredList = result.list.filter((item, index) => {
                if (
                    index === 0 ||
                    index === 8 ||
                    index === 16 ||
                    index === 24 ||
                    index === 32
                ) {
                    return item;
                }
            });

            // console.log(result.list);

            let listItems = filteredList.map((item, index) => {
                return this.renderItem(item, index);
            });

            return (
                <div class="weather" id="js-weather">
                    <header class="weather__header">
                        <div class="weather__city">
                            <i class="fa fa-map-marker" />
                            {result.city.name}
                        </div>
                        <div class="weather__country">{result.city.country}</div>
                    </header>
                    <ul class="weather__list">{listItems}</ul>
                </div>
            );
        }
    }
}

export default App;
