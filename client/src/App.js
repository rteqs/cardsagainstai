import logo from './logo.svg';
import './App.css';

const socket = new WebSocket('ws://localhost:8080');
function App() {
  // Create WebSocket connection.
  let id = null;

  // Connection opened
  socket.addEventListener('open', (event) => {
    console.log('Connected to server');
    console.log(event);
  });

  // Listen for messages
  socket.addEventListener('message', (event) => {
    const response = JSON.parse(event.data);
    console.log('Message from server ', response);
    switch (response.method) {
      case 'connect':
        id = response.id;
        break;

      default:
        console.log('Invalid method', response.method);
    }
    console.log(id);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
