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
        const key = 'weather';
        const cachedHits = localStorage.getItem(key);
        const cachedTimeStamp = localStorage.getItem(`${key}_timestamp`);
        const now = new Date().getTime() / 1000;
        // console.log(this.hoursBetween(Math.floor(now), parseInt(cachedTimeStamp)));
        if (cachedHits !== 'undefined' && (this.hoursBetween(Math.floor(now), parseInt(cachedTimeStamp)) <= 1)) {
            this.setState({
                isLoaded: true,
                result: JSON.parse(cachedHits)
            });
        } else {
            fetch(url)
                .then(res => res.json())
                .then(
                    result => {
                        this.setState({
                            isLoaded: true,
                            result: result
                        });

                        return result;
                    },
                    error => {
                        this.setState({
                            isLoaded: true,
                            error
                        });
                    }
                )
                .then(result => this.onSetResult(result, key));
        }
    }

    onSetResult = (result, key) => {
        const today = new Date().getTime() / 1000;
        localStorage.setItem(key, JSON.stringify(result));
        localStorage.setItem(`${key}_timestamp`, Math.floor(today));
    };

    hoursBetween = (d1, d2) => {
        return Math.abs(d1 - d2) / (60 * 60);
    };

    handleClick(e) {
        e.preventDefault();
        let test = document.querySelectorAll(".weather__item.active");
        [].forEach.call(test, function (el) {
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
        // console.log(item);
        let temp = item.main.temp - 273.15;
        temp = Math.round(temp * 100 / 100);
        let date = new Date(item.dt_txt.substring(0, 10));
        let day = date.getDay();
        let windDirection = this.getWindDirection(item.wind.deg);
        let windSpeed = Math.round((item.wind.speed * 2.2369362920544) * 100 / 100);

        return (
            <li className={"weather__item " + (index === 0 ? "active" : false)}
                onClick={this.handleClick}
                key={index}>
                <div className="weather__icon">
                    <i className={`wi icon-${item.weather[0].icon}`}/>
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
        const {error, isLoaded, result} = this.state;
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
                <div className="weather">
                    <header className="weather__header">
                        <div className="weather__city">
                            <i className="fa fa-map-marker"/>
                            {result.city.name}
                        </div>
                        <div className="weather__country">{result.city.country}</div>
                    </header>
                    <ul className="weather__list">{listItems}</ul>
                </div>
            );
        }
    }
}

export default App;
