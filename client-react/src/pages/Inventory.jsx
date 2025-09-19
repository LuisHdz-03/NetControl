import React from 'react';
import { FiWifi, FiCheckCircle, FiSearch, FiX } from 'react-icons/fi';
import { BiChip } from "react-icons/bi";
import { useInventoryLogic } from "../hooks/useInventoryLogic.js";

const Inventory = () => {
    const {
        loading, activeTab, setActiveTab, search, setSearch,
        newItem, handleAddChange, agregarInventario, eliminarDispositivo,
        filteredActiveUnits, filteredInventoryItems, handleDesactivar,
        // Props para el modal de activación
        isActivationModalOpen, setActivationModalOpen, unitToActivate, setUnitToActivate,
        handleActivateClick, handleConfirmActivation,
        // Props para el nuevo modal de actualización
        isUpdateModalOpen, setUpdateModalOpen, editingItem,
        openUpdateModal, handleUpdateChange, handleConfirmUpdate
    } = useInventoryLogic();

    return (
        <main className="container mx-auto p-4 lineaSeparadora font-sans">
            {/* Título */}
            <div className="text-center my-4 animacion">
                <h1 className="text-3xl font-bold text-white">Inventario</h1>
            </div>

            {/* Pestañas */}
            <div className="flex justify-center mb-6 border-b border-white">
                <button
                    className={`cursor-pointer relative px-6 py-2 font-semibold -mb-px ${activeTab === 'vista' ? 'text-[#168F27] border-b-4 border-[#168F27]' : 'text-white hover:text-[#168F27]'} transition-colors`}
                    onClick={() => setActiveTab('vista')}
                >
                    Dispositivos Activos
                </button>
                <button
                    className={`cursor-pointer relative px-6 py-2 font-semibold -mb-px ${activeTab === 'agregar' ? 'text-[#168F27] border-b-4 border-[#168F27]' : 'text-white hover:text-[#168F27]'} transition-colors`}
                    onClick={() => setActiveTab('agregar')}
                >
                    Agregar Dispositivo
                </button>
                <button
                    className={`cursor-pointer px-6 py-2 font-semibold ${activeTab === 'activar' ? 'text-[#168F27] border-b-4 border-[#168F27]' : 'text-white hover:text-[#168F27]'}`}
                    onClick={() => setActiveTab('activar')}
                >
                    Activar/Desactivar
                </button>
            </div>

            {/* Contenido de la pestaña: Vista de Dospositivos activos */}
            {activeTab === 'vista' && (
                <>
                    <div className="flex flex-col md:flex-row gap-4 mb-4 animacion">
                        <div className="bg-gray-300 shadow-md rounded-xl p-4 flex items-center justify-center gap-3 flex-1">
                            <FiCheckCircle className="text-green-600 text-3xl" />
                            <p className="text-black font-medium text-lg text-center">Dispositivos Activados</p>
                        </div>
                        <div className="flex items-center gap-2 flex-1">
                            <div className="relative flex-1">
                                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 text-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400" placeholder="BUSCA POR: NOMBRE, MODELO, NO. SERIE O UBICACIÓN" />
                            </div>
                            <button className="bg-[#168F27] text-white px-4 py-2 rounded-lg hover:bg-[#12701f] flex items-center gap-2 cursor-pointer" onClick={() => setSearch('')}><FiX className="text-lg" />Limpiar</button>
                        </div>
                    </div>
                    {loading ? (<p className="text-center text-white">Cargando...</p>) : filteredActiveUnits.length === 0 ? (<p className="text-center text-white text-lg">No hay dispositivos activados</p>) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animacion">
                            {filteredActiveUnits.map(item => (
                                <div key={item.id} className="relative overflow-hidden bg-gray-100 border border-gray-700 rounded-xl p-5 transition-all duration-300 ease-in-out hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
                                    <BiChip className="absolute inset-0 w-full h-full text-green-500/10 z-0" />
                                    <div className="relative z-10 flex flex-col h-full">
                                        <div className="mb-4">
                                            <h3 className="text-xl font-bold text-black mb-2 truncate">{item.nombre}</h3>
                                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/50 px-2.5 py-0.5 text-xs font-bold text-emerald-900">
                                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                                Activo
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-sm text-black-400 flex-grow">
                                            <p><strong className="font-medium text-black">Modelo:</strong> {item.modelo}</p>
                                            <p><strong className="font-medium text-black">No. Serie:</strong> {item.noSerie}</p>
                                            <p><strong className="font-medium text-black">Ubicación:</strong> {item.ubicacion}</p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-700/50 flex gap-2">
                                            <button className="w-full bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm font-semibold transition-colors cursor-pointer" onClick={() => openUpdateModal(item, 'activeUnit')}>Actualizar</button>
                                            <button className="w-full bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm font-semibold transition-colors cursor-pointer" onClick={() => handleDesactivar(item.id)}>Desactivar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Contenido de la pestaña: Agregar Dispositivo */}
            {activeTab === 'agregar' && (
                <div className="animacion max-w-md mx-auto"><form onSubmit={agregarInventario} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-lg relative"><div className="flex justify-center"> <FiWifi className="text-6xl text-green-600" /> </div><div className="text-center mb-4"><h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Dispositivo</h2><p className="text-gray-500 text-sm">Llena los datos a continuación</p></div><input type="text" name="nombre" value={newItem.nombre} onChange={handleAddChange} placeholder="Nombre" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]" required /><input type="text" name="modelo" value={newItem.modelo} onChange={handleAddChange} placeholder="Modelo" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]" required /><input type="text" name="noSerie" value={newItem.noSerie} onChange={handleAddChange} placeholder="No. Serie" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]" required /><input type="number" name="cantidadTotal" value={newItem.cantidadTotal} onChange={handleAddChange} placeholder="Cantidad" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]" required /><div className="flex justify-end mt-2"><button type="submit" className="bg-[#168F27] text-white px-4 py-2 rounded hover:bg-green-700 transition-colors cursor-pointer">Agregar</button></div></form></div>
            )}

            {/* Contenido de la pestaña: Activar/Desactivar */}
            {activeTab === 'activar' && (
                loading ? (<p className="text-center text-white">Cargando...</p>) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animacion">
                        {filteredInventoryItems.map(item => (
                            <div key={item.id} className="relative overflow-hidden bg-gray-100 border border-gray-700 rounded-xl p-5 transition-all duration-300 ease-in-out hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1">
                                <BiChip className="absolute inset-0 w-full h-full text-green-500/10 z-0" />
                                <div className="relative z-10 flex flex-col h-full">
                                    <h3 className="text-xl font-bold text-black mb-3 truncate">{item.nombre}</h3>
                                    <div className="space-y-1.5 text-sm text-black flex-grow">
                                        <p><strong className="font-medium text-black">Modelo:</strong> {item.modelo}</p>
                                        <p><strong className="font-medium text-black">No. Serie:</strong> {item.noSerie}</p>
                                        <div className="flex justify-between pt-2">
                                            <span><strong className="text-black">Total:</strong> {item.cantidadTotal}</span>
                                            <span className="text-emerald-600"><strong className="font-bold">Activas:</strong> {item.cantidadActiva}</span>
                                            <span className="text-yellow-600"><strong className="font-bold">Disponibles:</strong> {item.cantidadInactiva}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-700/50 flex gap-2">
                                        <button onClick={() => handleActivateClick(item)} className="w-full bg-[#168F27] text-white px-3 py-1.5 rounded-md hover:bg-green-700 text-sm font-semibold transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed cursor-pointer" disabled={item.cantidadInactiva <= 0}>Activar</button>
                                        <button className="w-full bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm font-semibold transition-colors cursor-pointer" onClick={() => openUpdateModal(item, 'inventory')}>Actualizar</button>
                                        <button className="w-full bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm font-semibold transition-colors cursor-pointer" onClick={() => eliminarDispositivo(item.id)}>Eliminar</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {/* Modal de Activación */}
            {isActivationModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                        <button className="absolute top-2 right-2 text-black hover:text-gray-800 text-2xl cursor-pointer" onClick={() => setActivationModalOpen(false)}>&times;</button>
                        <h2 className="text-xl font-bold mb-4">Activar: {unitToActivate?.nombre}</h2>
                        <input type="text" name="ubicacion" value={unitToActivate?.ubicacion || ""} onChange={e => setUnitToActivate({ ...unitToActivate, ubicacion: e.target.value })} placeholder="Ubicación de la nueva unidad" className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27] mb-4" required />
                        <div className="flex justify-end gap-3">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer" onClick={() => setActivationModalOpen(false)}>Cancelar</button>
                            <button className="bg-[#168F27] text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer" onClick={handleConfirmActivation}>Confirmar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Actualización */}
            {isUpdateModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
                        <button className="absolute top-2 right-2 text-black hover:text-gray-800 text-2xl cursor-pointer" onClick={() => setUpdateModalOpen(false)}>&times;</button>
                        <h2 className="text-xl font-bold mb-4">Actualizar: {editingItem?.nombre}</h2>
                        {editingItem?.type === 'inventory' ? (
                            <div className="flex flex-col gap-1">
                                <label htmlFor="nombre-update" className="block text-sm font-medium text-black ">
                                    Nombre:
                                </label>
                                <input id="nombre-update" type="text" name="nombre" value={editingItem.nombre} onChange={handleUpdateChange} placeholder="Nombre" className="border px-3 py-2 rounded" />
                                <label htmlFor="modelo-update: " className="block text-sm font-medium text-black ">
                                    Modelo:
                                </label>
                                <input id="modelo-update" type="text" name="modelo" value={editingItem.modelo} onChange={handleUpdateChange} placeholder="Modelo" className="border px-3 py-2 rounded" />
                                <label htmlFor="noSerie-update: " className="block text-sm font-medium text-black ">
                                    No. Serie:
                                </label>
                                <input id="noSerie-update" type="text" name="noSerie" value={editingItem.noSerie} onChange={handleUpdateChange} placeholder="No. Serie" className="border px-3 py-2 rounded" />
                                <label htmlFor="cantidadTotal-update: " className="block text-sm font-medium text-black ">
                                    Cantidad total:
                                </label>
                                <input id="cantidadTotal-update" type="number" name="cantidadTotal" value={editingItem.cantidadTotal} onChange={handleUpdateChange} placeholder="Cantidad Total" className="border px-3 py-2 rounded" />
                            </div>
                        ) : (
                            <input type="text" name="ubicacion" value={editingItem.ubicacion} onChange={handleUpdateChange} placeholder="Ubicación" className="w-full border px-3 py-2 rounded" />
                        )}
                        <div className="flex justify-end gap-3 mt-4">
                            <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 cursor-pointer" onClick={() => setUpdateModalOpen(false)}>Cancelar</button>
                            <button className="bg-[#168F27] text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer" onClick={handleConfirmUpdate}>Guardar Cambios</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Inventory;

