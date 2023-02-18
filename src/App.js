import {Component} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      latitude: null,
      longitude: null,
      inputField: '',
      newWeatherData: {},
      apiStatus: apiStatusConstants.initial,
      presentLocationData: {},
    }
  }

  componentDidMount() {
    this.getDeviceLocation()
  }

  getDeviceLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          // error: null,
        })
      },
      error => {
        console.log(error)
        // this.setState({error: error.message})
      },
    )
    this.getCurrentLocationFullDetails()
  }

  getCurrentLocationFullDetails = async () => {
    const {latitude, longitude} = this.state

    const response = await fetch(
      `http://api.weatherstack.com/current?access_key=ee2c00a09ba65e4467143d28625d3fa2&query=${latitude}, ${longitude}`,
    )
    const data = await response.json()
    console.log(data)
    const presentLocation = {
      temperature: data.current.temperature,
      humidity: data.current.humidity,
      img: data.current.weather_icons,
      description: data.current.weather_descriptions[0],
      pressure: data.current.pressure,
      windSpeed: data.current.wind_speed,
      precip: data.current.precip,
      country: data.location.country,
      localtime: data.location.localtime,
      region: data.location.region,
      name: data.location.name,
    }
    this.setState({presentLocationData: presentLocation})
  }

  getInputDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const {inputField} = this.state
    console.log(inputField)

    const response = await fetch(
      `http://api.weatherstack.com/current?access_key=ee2c00a09ba65e4467143d28625d3fa2&query=${inputField}`,
    )
    const data = await response.json()
    console.log(data)
    const newData = {
      temperature: data.current.temperature,
      humidity: data.current.humidity,
      img: data.current.weather_icons,
      description: data.current.weather_descriptions[0],
      pressure: data.current.pressure,
      windSpeed: data.current.wind_speed,
      precip: data.current.precip,
      country: data.location.country,
      localtime: data.location.localtime,
      region: data.location.region,
      name: data.location.name,
    }
    this.setState({
      newWeatherData: newData,
      apiStatus: apiStatusConstants.success,
      inputField: '',
    })
  }

  onChangeInputField = e => {
    this.setState({inputField: e.target.value})
  }

  onSubmitForm = e => {
    e.preventDefault()

    this.getInputDetails()
  }

  getCurrentLocation = () => {
    const {presentLocationData} = this.state
    const {
      temperature,
      pressure,
      humidity,
      country,
      description,
      img,
      region,
      precip,
      windSpeed,
      localtime,
    } = presentLocationData
    return (
      <>
        <div className="bottom-flex-box">
          <h1>
            {temperature}
            <sup>o</sup>C , {description}
          </h1>
          <p>
            {region} ,<br /> {country}
          </p>
          <div>
            <img src={img} alt="weather-img" />
          </div>
        </div>

        <div className="bottom-flex-box">
          <div>
            <p>
              <b>Wind Speed</b>(km/hr)
            </p>
            <h2>{windSpeed}</h2>
          </div>
          <div>
            <p>
              <b>Preassure</b>(millibar)
            </p>
            <h2>{pressure}</h2>
          </div>
          <div>
            <p>
              <b>Precipitation</b>(mm)
            </p>
            <h2>{precip}</h2>
          </div>
          <div>
            <p>
              <b>Humidity</b>(%)
            </p>
            <h2>{humidity}</h2>
          </div>
          <div>
            <p>
              <b>LocalTime</b>
            </p>
            <h2>{localtime}</h2>
          </div>
        </div>
      </>
    )
  }

  renderUserSearchLocation = () => {
    const {newWeatherData} = this.state
    const {
      temperature,
      pressure,
      humidity,
      country,
      description,
      img,
      region,
      precip,
      windSpeed,
      localtime,
    } = newWeatherData
    return (
      <>
        <div className="bottom-flex-box">
          <h1>
            {temperature}
            <sup>o</sup>C , {description}
          </h1>
          <p>
            {region} ,<br /> {country}
          </p>
          <div>
            <img src={img} alt="weather-img" />
          </div>
        </div>
        <div className="bottom-flex-box">
          <div>
            <h1>
              {temperature}
              <sup>o</sup>C , {description}
            </h1>
            <p>
              <b>Wind Speed</b>(km/hr)
            </p>
            <h2>{windSpeed}</h2>
          </div>
          <div>
            <p>
              <b>Preassure</b>(millibar)
            </p>
            <h2>{pressure}</h2>
          </div>
          <div>
            <p>
              <b>Precipitation</b>(mm)
            </p>
            <h2>{precip}</h2>
          </div>
          <div>
            <p>
              <b>Humidity</b>(%)
            </p>
            <h2>{humidity}</h2>
          </div>
          <div>
            <p>
              <b>LocalTime</b>
            </p>
            <h2>{localtime}</h2>
          </div>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="Circles" color="#ffffff" height="50" width="50" />
    </div>
  )

  getWeatherInfomation = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.initial:
        return this.getCurrentLocation()
      case apiStatusConstants.success:
        return this.renderUserSearchLocation()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="render-class">
          <h1 className="weather-app">Weather-App</h1>
          <form onSubmit={this.onSubmitForm}>
            <input
              className="searchInput"
              onChange={this.onChangeInputField}
              type="search"
              placeholder="Enter location"
            />
          </form>
          <br />
        </div>
        <div className="box">{this.getWeatherInfomation()}</div>
      </>
    )
  }
}
export default App
