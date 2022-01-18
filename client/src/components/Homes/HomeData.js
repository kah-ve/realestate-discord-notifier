import React from "react";
import "./HomeData.css";
import { ImHome } from "react-icons/im";
import { IoMdHeartDislike } from "react-icons/io";
import FrontPage from "../FrontPage/FrontPage";
import { parsePrice } from "../common";

class ErrorMessages {
  constructor(params = null) {
    this.messages = params
      ? params
      : {
          zipcode: "",
          price: "",
          location: "",
          bedrooms: "",
          sqft: "",
        };
  }

  get zipcode() {
    return this.messages.zipcode;
  }

  update(param_key, param_value) {
    this.messages = Object.assign(this.messages, { [param_key]: param_value });
    return this;
  }
}

class HomeData extends React.Component {
  keyCount = 0;

  constructor(props) {
    super(props);

    this.state = {
      response: "Load Homes!",
      status: "waiting",
      zipcode: "08016",
      error_message: new ErrorMessages(),
      high: "500000",
      low: "0",
    };

    this.getResponse = this.getResponse.bind(this);
    this.getLinkRows = this.getLinkRows.bind(this);
    this.searchZipCode = this.searchZipCode.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getKey = this.getKey.bind(this);
    this.getPriceRange = this.getPriceRange.bind(this);
  }

  async getResponse() {
    console.log(this.state.error_message.zipcode);
    if (this.state.error_message.zipcode !== "") {
      return;
    }

    this.setState({
      response: "Loading...",
    });

    console.log("Trying to get response!");
    try {
      const res = await fetch(
        `http://localhost:5000/api/gethomes?zipcode=${this.state.zipcode}`
      );

      const res_json = await res.json();
      console.log(res_json);
      // console.log(res_json)
      this.setState({
        response: res_json !== null ? res_json : "No home data to get!",
        status: res_json !== null ? "ready" : "waiting",
      });
    } catch (error) {
      console.error(error);
      this.setState({
        response: "No home data to get!",
      });
    }
  }

  getKey() {
    return this.keyCount++;
  }

  getLinkRows() {
    let homeLinks = [];
    for (let i = 0; i < this.state.response.length; i++) {
      // let [url, home_address, img_link] = this.state.response[i];
      let homeInfo = this.state.response[i];

      let parsedHomePrice = parsePrice(homeInfo["price"]);
      let parsedHigh = parsePrice(this.state.high);
      let parsedLow = parsePrice(this.state.low);
      if (parsedHomePrice <= parsedHigh && parsedHomePrice >= parsedLow) {
        homeLinks.push(
          <div key={this.getKey()} class="home-info-display">
            Price: {homeInfo["price"]}
            <a href={homeInfo["url"]} target="_blank" className="home-href">
              <span className="home-links">
                {homeInfo["imgLink"] !== "" ? (
                  <img className="home-preview" src={homeInfo["imgLink"]}></img>
                ) : (
                  <span className="home-preview-icon">
                    <ImHome />
                  </span>
                )}
                {homeInfo["address"]}
              </span>
            </a>
          </div>
        );
      }
    }

    return homeLinks;
  }

  async searchZipCode() {
    console.log("Posting to DB!");

    let value = {
      zipcode: this.state.zipcode,
    };

    let data = JSON.stringify(value);

    fetch("http://localhost:5000/api/searchZipCode", {
      method: "POST",
      body: data,
    });
  }

  handleChange(evt) {
    const value = evt.target.value;
    const targetName = evt.target.name.toLowerCase();

    if (targetName === "zipcode") {
      this.setState({
        targetName: value,
      });

      if (evt.target.value.length === 5) {
        this.setState({
          [targetName]: evt.target.value,
          error_message: this.state.error_message.update(targetName, ""),
        });
      } else {
        console.log("Invalid Zipcode.");
        let currentLength = value.length;
        console.log(value);
        this.setState({
          [targetName]: evt.target.value,
          error_message: this.state.error_message.update(
            targetName,
            `*Zipcode must be 5 digits. 
        Your zipcode has ${currentLength} digits.`
          ),
        });
        return;
      }
    } else if (targetName == "GetHomes") {
      console.log("I'm here");
    } else {
      this.setState({ [targetName]: value });
    }
  }

  getPriceRange(name) {
    if (name === "high") {
      return this.state.high;
    } else {
      return this.state.low;
    }
  }

  render() {
    return (
      <div className="zipcode-search-and-display">
        <FilterHomes
          getPriceRange={this.getPriceRange}
          handleChange={this.handleChange}
        />
        <div
          className={`get-homes-container`}
          name="GetHomes"
          onClick={this.state.status === "waiting" ? this.getResponse : null}
        >
          {this.state.status === "ready"
            ? this.getLinkRows()
            : this.state.response}
        </div>
        <div className="error-message-input">
          {this.state.error_message.zipcode}
        </div>
      </div>
    );
  }
}

class FilterHomes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="filter-homes">
        <RefreshBox name="Refresh" onClick={() => window.location.reload()} />
        <InputBox
          type="text"
          name="Zipcode"
          handleChange={this.props.handleChange}
        />
        <PriceRange
          getPriceRange={this.props.getPriceRange}
          handleChange={this.props.handleChange}
        />
      </div>
    );
  }
}

class InputBox extends React.Component {
  constructor(props) {
    super(props);

    this.type = props.type || "text";
    this.name = props.name || "Zipcode";
  }

  render() {
    return (
      <div className="submitForm">
        <div className="inputBoxes">
          {this.name}
          <input
            className="inputText"
            onChange={this.props.handleChange}
            type={this.type}
            name={this.name}
            onClick={this.props.onClick}
            defaultValue="08016"
          />
        </div>
      </div>
    );
  }
}

class PriceRange extends React.Component {
  constructor(props) {
    super(props);

    this.name = props.name || "Price Range";
  }

  render() {
    return (
      <div className="inputBoxes">
        Price Range
        <div className="price-slider-container">
          <span className="price-label">Low</span>
          <span className="range-value">
            {this.props
              .getPriceRange("low")
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
          <input
            className="price-slider"
            onChange={this.props.handleChange}
            type="range"
            min="0"
            max="500000"
            name="Low"
            step="10000"
            value={this.props.getPriceRange("low")}
          />
          <span className="price-label">High</span>
          <span className="range-value">
            {this.props
              .getPriceRange("high")
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </span>
          <input
            className="price-slider"
            onChange={this.props.handleChange}
            type="range"
            min="0"
            max="500000"
            step="10000"
            name="High"
            value={this.props.getPriceRange("high")}
          />
        </div>
      </div>
    );
  }
}

class RefreshBox extends React.Component {
  constructor(props) {
    super(props);

    this.name = props.name || "Refresh";
  }

  render() {
    return (
      <div className="inputBoxes refreshButton" onClick={this.props.onClick}>
        {this.name}
      </div>
    );
  }
}

export default HomeData;
