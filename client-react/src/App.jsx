import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home'
import Inventory from './pages/Inventory';
import Technicians from './pages/Technicians';
import "./App.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Failures from './pages/Failures';
import Dispositivos from "./pages/Dispositivos";
import Documentation from './pages/Documentation';

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div>
      <BrowserRouter>
        {/*
        {!isLoaded ? (
          <Loading setIsLoaded={setIsLoaded} />
        ) : (
         */}
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/dispositivos" element={<Dispositivos />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/technicians" element={<Technicians />} />
            <Route path="/failures" element={<Failures />} />
            <Route path="/documentation" element={<Documentation />} />
          </Route>
        </Routes>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </BrowserRouter>
    </div>
  );
};

export default App;
