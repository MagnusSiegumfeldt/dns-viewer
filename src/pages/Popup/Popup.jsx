import React, { Component } from 'react'
import './Popup.css';
import ContentContainer from '../../assets/components/ContentContainer';
import 'bootstrap/dist/css/bootstrap.css';



export class Popup extends Component {
  state = {
    domain: null
  };

  
  componentDidMount() {
    // Get url
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      let domain = tabs[0].url.split("/")[2].replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
      this.setState({
        domain: domain
      });
    });
  }


  render() {
    return (
      <div className="App" >
        <ContentContainer domain={this.state.domain} />
      </div>
    )
  };
};

export default Popup;
