// frontend-react/src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // For global styles if any, or can remove if App.css handles all
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);