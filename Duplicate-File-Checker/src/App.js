import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

const {app} = window.require ? window.require('electron').remote : '';

class App extends Component {
	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo" />
					<h2>React + Electron = <span role="img" aria-label="love">😍</span></h2>
				</div>
				<p className="App-intro">
					<p>
						<b>Expected Version: 0.2.7 </b>
					</p>
					<p>
						Version from Electron: {app.getVersion()}
					</p>
				</p>
			</div>
		);
	}
}

export default App;