
import React from 'react';
import ReactDOM from 'react-dom/client'; // Import createRoot instead of ReactDOM
import App from './App';
import './Header.css'; 
import './globals.css';

const container = document.getElementById('app'); // Get the root container
const root = ReactDOM.createRoot(container); // Create a root

// Render the App component
root.render(
  
    <React.StrictMode>
      <App />
    </React.StrictMode>
 

);
