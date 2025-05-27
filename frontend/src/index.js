import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './home';
import Login from './login';
import './home.css';
import './login.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>
);