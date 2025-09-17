import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
//import Loading from './components/Loading';
import Home from './pages/Home'
import Inventory from './pages/Inventory';
import "./App.css"

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div style={{ fontFamily: "DRAGON HUNTER, sans-serif" }}>
      <BrowserRouter>
        {/*
        {!isLoaded ? (
          <Loading setIsLoaded={setIsLoaded} />
        ) : (
         */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
          </Route>
        </Routes>
        {/*)}*/}
      </BrowserRouter>
    </div>
  );
};

export default App;