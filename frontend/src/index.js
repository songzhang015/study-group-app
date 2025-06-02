/*
The Entrypoint for CS 422 Project 2: Study Group App

This file contains the entrypoint for the react program, 
written in javascript.

This file pretty much just loads the code for the menus.

Authors: Sawyer Christensen, Kaleo Montero
Last Modified: 05/27/2025
*/
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