import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiAlertTriangle,
  FiCpu,
  FiArchive,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import logoImage from "../assets/logo.jpg";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Botón hamburguesa visible solo en pantallas pequeñas */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[#168F27] text-white rounded-lg focus:outline-none cursor-pointer"
      >
        {isOpen ? (
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`bg-[#1E1E1E] fixed top-0 left-0 w-64 h-full text-white shadow-md z-40 transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex flex-col items-center p-4 border-b border-[#ffffff]">
          <img
            src={logoImage}
            alt="Logo NetControl"
            className="h-16 w-16 rounded-full object-cover mb-4 border-2 border-[#168F27]"
          />
          <h2 className="text-2xl font-bold text-[#EAEAEA]">NetControl</h2>
        </div>

        {/* Navegación */}
        <nav className="flex flex-col p-4 space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg flex items-center transition-colors duration-200 ${
                isActive
                  ? "bg-[#168F27] text-white font-bold"
                  : "text-[#B0B0B0] hover:bg-[#168F27] hover:text-white"
              }`
            }
          >
            <FiHome className="h-6 w-6 mr-2" />
            Inicio
          </NavLink>

          <NavLink
            to="/failures"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg flex items-center transition-colors duration-200 ${
                isActive
                  ? "bg-[#168F27] text-white font-bold"
                  : "text-[#B0B0B0] hover:bg-[#168F27] hover:text-white"
              }`
            }
          >
            <FiAlertTriangle className="h-6 w-6 mr-2" />
            Fallas
          </NavLink>

          <NavLink
            to="/dispositivos"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg flex items-center transition-colors duration-200 ${
                isActive
                  ? "bg-[#168F27] text-white font-bold"
                  : "text-[#B0B0B0] hover:bg-[#168F27] hover:text-white"
              }`
            }
          >
            <FiCpu className="h-6 w-6 mr-2" />
            Dispositivos
          </NavLink>

          <NavLink
            to="/inventory"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg flex items-center transition-colors duration-200 ${
                isActive
                  ? "bg-[#168F27] text-white font-bold"
                  : "text-[#B0B0B0] hover:bg-[#168F27] hover:text-white"
              }`
            }
          >
            <FiArchive className="h-6 w-6 mr-2" />
            Inventario
          </NavLink>

          <NavLink
            to="/technicians"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg flex items-center transition-colors duration-200 ${
                isActive
                  ? "bg-[#168F27] text-white font-bold"
                  : "text-[#B0B0B0] hover:bg-[#168F27] hover:text-white"
              }`
            }
          >
            <FiUsers className="h-6 w-6 mr-2" />
            Técnicos
          </NavLink>

          <NavLink
            to="/logout"
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg flex items-center transition-colors duration-200 ${
                isActive
                  ? "bg-[#168F27] text-white font-bold"
                  : "text-[#B0B0B0] hover:bg-[#168F27] hover:text-white"
              }`
            }
          >
            <FiLogOut className="h-6 w-6 mr-2" />
            Salir
          </NavLink>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
