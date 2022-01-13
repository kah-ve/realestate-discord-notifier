import React from "react";
import "./HomeData.css";
import { ImHome } from "react-icons/im";

class HomeData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      response: "Load Homes!",
      status: "waiting",
      zipcode: "08016"
    };

    this.getResponse = this.getResponse.bind(this);
    this.getLinkRows = this.getLinkRows.bind(this);
    this.searchZipCode = this.searchZipCode.bind(this);
    this.handleZipCodeChange = this.handleZipCodeChange.bind(this)
  }

  async getResponse() {
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

  getLinkRows() {
    let homeLinks = []
    for (let i=0; i < this.state.response.length; i++) {
      let [url, home_address, img_link] = this.state.response[i]
      homeLinks.push(<span className="home-links">
        {img_link !== "" ? (<img className="home-preview" src={img_link}></img>) : (<span className="home-preview-icon"><ImHome /></span>)}
        <a href={url} target="_blank" className="home-href">{home_address}</a></span>)
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
      headers: {
        "Content-Type": "application/json",
      },
      mode: "no-cors",
      body: data,
    });
  }

  handleZipCodeChange(evt) {
    const value = evt.target.value;

    this.setState({
      "zipcode": value
    })
  }

  render() {
    return (
      <div className="zipcode-search-and-display">
        <InputBox handleChange={this.handleZipCodeChange} />
        <div className="get-homes-container" onClick={this.state.status === "waiting" ? this.getResponse : null}>
            {this.state.status === "ready" ? this.getLinkRows() : this.state.response}
        </div>
      </div>
    );
  }
}


class InputBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="submitForm">
          <div className="inputBoxes">
            Zipcode
            <input
              className="inputText"
              onChange={this.props.handleChange}
              type="text"
              name="zipcode"
              defaultValue="08016"
            />
          </div>
      </div>

    );
  }
}

export default HomeData;


