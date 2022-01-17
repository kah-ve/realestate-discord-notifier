import React from "react";
import "./HomeData.css";
import { ImHome } from "react-icons/im";
import { IoMdHeartDislike } from "react-icons/io";

class ErrorMessages {
  constructor(params = null) {
    this.messages = params ? params : {
      zipcode: "",
      price: "",
      location: "",
      bedrooms: "",
      sqft: "",
    }
  }

  get zipcode() {
    return this.messages.zipcode;
  }
  
  update(param_key, param_value) {
    this.messages = Object.assign(this.messages, {[param_key]: param_value})
    return this
  }
}


class HomeData extends React.Component {
  keyCount = 0

  constructor(props) {
    super(props);

    this.state = {
      response: "Load Homes!",
      status: "waiting",
      zipcode: "08016",
      error_message: new ErrorMessages(),
    };

    this.getResponse = this.getResponse.bind(this);
    this.getLinkRows = this.getLinkRows.bind(this);
    this.searchZipCode = this.searchZipCode.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getKey = this.getKey.bind(this);
  }

  async getResponse() {
    console.log(this.state.error_message.zipcode)
    if (this.state.error_message.zipcode !== "") {
      return
    }

    this.setState({
      response: "Loading...",
    });

    console.log("Trying to get response!");
    try {
      const res = await fetch(`http://localhost:5000/api/gethomes?zipcode=${this.state.zipcode}`);
      const res_json = await res.json();
      console.log(res_json);
      // console.log(res_json)
      this.setState({
        response: res_json !== null ? res_json : "No home data to get!",
        status: res_json !== null ? "ready" : "waiting"
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
    let homeLinks = []
    for (let i=0; i < this.state.response.length; i++) {
      let [url, home_address, img_link] = this.state.response[i]
      homeLinks.push(<a key={this.getKey()} href={url} target="_blank" className="home-href"><span className="home-links">
        {img_link !== "" ? (<img className="home-preview" src={img_link}></img>) : (<span className="home-preview-icon"><ImHome /></span>)}
        {home_address}</span></a>)
    }

    return homeLinks
  }


  async searchZipCode() {
    console.log("Posting to DB!");

    let value = {
      "zipcode": this.state.zipcode,
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
        this.setState({[targetName]: evt.target.value, "error_message": this.state.error_message.update(targetName, "")});
      }
      else {
        console.log("Invalid Zipcode.")
        let currentLength = value.length
        console.log(value)
        this.setState({[targetName]: evt.target.value, "error_message": this.state.error_message.update(targetName, `*Zipcode must be 5 digits. 
        Your zipcode has ${currentLength} digits.`)});
        return
      }
    }
    else if (targetName == "GetHomes") {
      console.log("I'm here")
    }
  }

  render() {
    return (
      <div className="zipcode-search-and-display">
        <FilterHomes handleChange={this.handleChange} />
        <div className="get-homes-container" name="GetHomes" onClick={this.state.status === "waiting" ? this.getResponse : null}>
            {this.state.status === "ready" ? this.getLinkRows() : this.state.response}
        </div>
        <div className="error-message-input">{this.state.error_message.zipcode}</div>
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
        <RefreshBox name="Refresh" onClick={() => window.location.reload()}/>
        <InputBox type="text" name="Zipcode" handleChange={this.props.handleChange}/>
        <PriceRange handleChange={this.props.handleChange}/>
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

    this.state = {
      "low": "0",
      "high": "500000"
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(evt) {
    const value = evt.target.value;
    const targetName = evt.target.name.toLowerCase();

    console.log(targetName)
    console.log(value)

    this.setState({[targetName]: value})
  }
 
  render() {
    return (
      <div className="inputBoxes">
            Price Range
          <div className="price-range-sel-container">
            <span className="price-label">Low</span>
            <span className="range-value">{this.state.low}</span>
            <input
              className="price-range-sel-input"
              onChange={this.handleChange}
              type="range"
              min="1"
              max="500000"
              name="Low"
              value={this.state.low}
            />
            <span className="price-label">High</span>
            <span className="range-value">{this.state.high}</span>
            <input
              className="price-range-sel-input"
              onChange={this.handleChange}
              type="range"
              min="1"
              max="500000"
              name="High"
              value={this.state.high}
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


