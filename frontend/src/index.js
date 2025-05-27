import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './home';
import Login from './login';
import './home.css';
import './login.css';

import { BrowserRouter, Route, Routes } from "react-router";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<Login />}></Route>
      <Route path="/home" element={<Home />}></Route>
     </Routes>
   </BrowserRouter>
  </React.StrictMode>
);