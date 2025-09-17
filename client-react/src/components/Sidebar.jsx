import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import logoImage from "../../public/logo.jpg";

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
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
            </button>

            <aside className={`bg-[#1E1E1E] fixed top-0 left-0 w-64 h-full text-white shadow-md z-40 transform transition-transform duration-300 ease-in-out
            ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
                <div className="flex flex-col items-center p-4 border-b border-[#ffffff]">
                    <img
                        src={logoImage}
                        alt="User Profile"
                        className="h-16 w-16 rounded-full object-cover mb-4 border-2 border-[#168F27]"
                    />
                    <h2 className="text-2xl font-bold text-[#EAEAEA]">NetControl</h2>
                </div>

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
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10 L12 3 L21 10 L21 20 H14 V14 H10 V20 H3 V10 Z" />
                        </svg>
                        Inicio
                    </NavLink>

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
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 20V10 M10 20V4 M16 20V14 M2 20H22" />
                        </svg>
                        Fallas
                    </NavLink>

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
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <circle cx="12" cy="11" r="4" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 21c0-3 3-5 6-5s6 2 6 5 M19 8v4 M17 10h4" />
                        </svg>
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
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Inventario
                    </NavLink>

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
                        <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 17l5-5-5-5 M15 12H3 M21 3v18" />
                        </svg>
                        Salir
                    </NavLink>
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
