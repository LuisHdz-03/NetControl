import React, { useState, useEffect } from 'react';
import { FiWifi } from 'react-icons/fi';
import CustomSelect from '../components/Select';
import { useInventory } from "../hooks/userInventory.js";

const Invetory = () => {
    const { items, loading, add, remove } = useInventory();
    const [activeTab, setActiveTab] = useState("vista");
    const [search, setSearch] = useState("");
    const [newItem, setNewItem] = useState({
        nombre: "",
        modelo: "",
        noSerie: "",
        total: "",
        ubicacion: "",
        estado: "Activo",
    });

    const handleAddChange = (e) =>
        setNewItem({ ...newItem, [e.target.name]: e.target.value });

    const agregarInventario = async (e) => {
        e.preventDefault();
        await add(newItem);
        setNewItem({
            nombre: "",
            modelo: "",
            noSerie: "",
            total: "",
            ubicacion: "",
            estado: "Activo",
        });
        setActiveTab("vista");
    };

    const eliminarDispositivo = (id) => remove(id);

    const filteredData = items.filter(
        (item) =>
            item.nombre.toLowerCase().includes(search.toLowerCase()) ||
            item.modelo.toLowerCase().includes(search.toLowerCase()) ||
            item.noSerie.toLowerCase().includes(search.toLowerCase()) ||
            item.ubicacion.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <main className="container mx-auto p-4 lineaSeparadora font-sans">

            {/* Título */}
            <div className="text-center my-4 animacion">
                <h1 className="text-3xl font-bold text-white">Inventario</h1>
            </div>

            {/* Pestañas */}
            <div className="flex justify-center mb-6 border-b border-white">
                <button
                    className={`cursor-pointer relative px-6 py-2 font-semibold -mb-px ${activeTab === 'vista'
                        ? 'text-[#168F27] border-b-4 border-[#168F27]'
                        : 'text-white hover:text-[#168F27]'
                        } transition-colors`}
                    onClick={() => setActiveTab('vista')}
                >
                    Vista de inventario
                </button>
                <button
                    className={`cursor-pointer relative px-6 py-2 font-semibold -mb-px ${activeTab === 'agregar'
                        ? 'text-[#168F27] border-b-4 border-[#168F27]'
                        : 'text-white hover:text-[#168F27]'
                        } transition-colors`}
                    onClick={() => setActiveTab('agregar')}
                >
                    Agregar Dispositivo
                </button>
            </div>

            {/* Contenido de la pestaña */}
            {activeTab === 'vista' && (
                <>
                    {/* Barra de búsqueda */}
                    <div className="flex items-center gap-2 animacion mb-4">
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="flex-1 text-white border border-white rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#168F27]"
                            placeholder="BUSCA POR: ID, NOMBRE, MODELO, NO. SERIE O UBICACIÓN"
                        />
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer"
                            onClick={() => setSearch('')}
                        >
                            Limpiar
                        </button>
                    </div>

                    {/* Inventario como tarjetas */}
                    {loading ? (
                        <p className="text-center text-white">Cargando...</p>
                    ) : filteredData.length === 0 ? (
                        <p className="text-center text-white text-lg">Inventario vacío</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animacion">
                            {filteredData.map(item => (
                                <div key={item.id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col">
                                    <h3 className="text-xl font-semibold mb-2">{item.nombre}</h3>
                                    <p><strong>Modelo:</strong> {item.modelo}</p>
                                    <p><strong>No. Serie:</strong> {item.noSerie}</p>
                                    <p><strong>Total:</strong> {item.total}</p>
                                    <p><strong>Ubicación:</strong> {item.ubicacion}</p>
                                    <p className={`font-semibold mt-2 ${item.estado === 'Activo' ? 'text-green-600' : 'text-red-600'}`}>
                                        {item.estado}
                                    </p>
                                    <div className="mt-auto flex gap-2 pt-4">
                                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm cursor-pointer">
                                            Detalles / Actualizar
                                        </button>
                                        <button
                                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm cursor-pointer"
                                            onClick={() => eliminarDispositivo(item.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {activeTab === 'agregar' && (
                <div className="animacion max-w-md mx-auto">
                    <form onSubmit={agregarInventario} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-lg relative">

                        {/* Ícono */}
                        <div className="flex justify-center">
                            <FiWifi className="text-6xl text-green-600" />
                        </div>

                        {/* Título del formulario */}
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Dispositivo</h2>
                            <p className="text-gray-500 text-sm">Llena los datos a continuación</p>
                        </div>

                        {/* Inputs */}
                        <input
                            type="text"
                            name="nombre"
                            value={newItem.nombre}
                            onChange={handleAddChange}
                            placeholder="Nombre"
                            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]"
                            required
                        />
                        <input
                            type="text"
                            name="modelo"
                            value={newItem.modelo}
                            onChange={handleAddChange}
                            placeholder="Modelo"
                            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]"
                            required
                        />
                        <input
                            type="text"
                            name="noSerie"
                            value={newItem.noSerie}
                            onChange={handleAddChange}
                            placeholder="No. Serie"
                            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]"
                            required
                        />
                        <input
                            type="number"
                            name="total"
                            value={newItem.total}
                            onChange={handleAddChange}
                            placeholder="Cantidad"
                            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]"
                            required
                        />
                        <input
                            type="text"
                            name="ubicacion"
                            value={newItem.ubicacion}
                            onChange={handleAddChange}
                            placeholder="Ubicación"
                            className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]"
                            required
                        />
                        <CustomSelect
                            name="estado"
                            value={newItem.estado}
                            onChange={handleAddChange}
                            options={[
                                { value: 'Activo', label: 'Activo' },
                                { value: 'Inactivo', label: 'Inactivo' },
                            ]}
                        />

                        {/* Botón de agregar */}
                        <div className="flex justify-end mt-2">
                            <button
                                type="submit"
                                className="bg-[#168F27] text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                            >
                                Agregar
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
};

export default Invetory;
