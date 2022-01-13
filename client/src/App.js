import './App.css';
import FrontPage from './components/FrontPage/FrontPage.js';
import React from 'react';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <FrontPage />
    )
  }
}


export default App;
