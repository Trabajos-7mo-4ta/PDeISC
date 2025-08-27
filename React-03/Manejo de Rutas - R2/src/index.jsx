import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Renderiza la aplicación en el div con id="root"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);