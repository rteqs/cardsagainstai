import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import reportWebVitals from './reportWebVitals';
import Lobby from './pages/Lobby';
import GameScreen from './pages/GameScreen';


ReactDOM.render(
	<React.StrictMode>
		<Router>
			<Switch>
				<Route path="/games/:gameID" component={GameScreen} />
				<Route path="/lobby" component={Lobby} />
				<Route path="/" render={() =>
					 (
						<div>
							<div className="pageNavbar">
								CARDS AGAINST AI
							</div>
							<div className="pageWrapper">
								<p>Lorem ipsum dolor sit amet Mauris at nunc a ante sodales blandit. Donec dignissim arcu turpis, quis commodo libero lacinia eget. Nunc pulvinar pulvinar lacus at tincidunt. Vestibulum vehicula eu libero eget posuere. Donec a consectetur magna, nec dictum felis. Duis vitae pellentesque dolor. Mauris ac arcu tempus, finibus leo venenatis, lobortis tellus. Curabitur finibus, velit sit amet sollicitudin mattis, felis dolor bibendum purus, eget feugiat augue dolor et enim. Sed accumsan, orci at accumsan iaculis, justo ante vulputate lorem, vitae venenatis mi ligula at sem. Cras sed elit quis metus consequat bibendum. Pellentesque semper vehicula volutpat. Phasellus eu ultrices justo.

Donec aliquam lorem orci, quis lacinia enim efficitur in. Phasellus lacus tortor, tempus ac augue sed, aliquet pharetra dui. Vestibulum ut libero eget lectus maximus auctor. Donec venenatis eros et volutpat ullamcorper. Integer convallis nibh mi. Nam hendrerit ipsum vel nisi fringilla pretium. Sed ac felis dictum, ultrices justo ut, porta velit. Sed viverra venenatis eros ut efficitur.</p>
								<button className="lobbyButton" type="button" onClick={() => { window.location.href = "/lobby"; }}>
									Go to The Lobby
								</button>
							</div>
						</div>)
				} />
			</Switch>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
