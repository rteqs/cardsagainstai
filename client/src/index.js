import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import WhiteCard from './WhiteCardTemplate';
import BlackCard from './BlackCardTemplate';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
	  <React.StrictMode>
	  	<App />
	  	<div id="out" className="outerContainer" style={{backgroundColor: "#ffa0ff", overflow: "hidden"}}>
		  	<div className="blackContainer" style={{backgroundColor: "#a0a0ff", overflow: "hidden"}}>
		  		<BlackCard />
		    </div>
		    <div className="whiteContainer" style={{backgroundColor: "#ffa0a0", overflow: "hidden"}}>
		    	<WhiteCard />
		   		<WhiteCard />
		    </div>
	    </div>
	  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
