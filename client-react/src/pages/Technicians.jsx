import React, { useState } from 'react';
import { FiSearch, FiX, FiUser, FiEdit } from 'react-icons/fi';
import { useTecnicos } from '../hooks/useTechnicians.js';

const Technicians = () => {
    const { tecnicos, loading, add, remove, update } = useTecnicos();
    const [activeTab, setActiveTab] = useState('tecnicos');
    const [search, setSearch] = useState('');
    const [newTecnico, setNewTecnico] = useState({ nombre: '', especialidad: '', telefono: '' });

    // Modal de actualización
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTecnico, setSelectedTecnico] = useState(null);

    // Filtra tecnicos
    const filteredTecnicos = tecnicos.filter(t =>
        t.nombre.toLowerCase().includes(search.toLowerCase()) ||
        t.especialidad.toLowerCase().includes(search.toLowerCase()) ||
        t.telefono.includes(search)
    );

    const handleAddChange = e => setNewTecnico({ ...newTecnico, [e.target.name]: e.target.value });
    const handleUpdateChange = e => setSelectedTecnico({ ...selectedTecnico, [e.target.name]: e.target.value });

    const agregarTecnico = async e => {
        e.preventDefault();
        await add(newTecnico);
        setNewTecnico({ nombre: '', especialidad: '', telefono: '' });
        setActiveTab('tecnicos');
    };

    const openUpdateModal = tecnico => {
        setSelectedTecnico(tecnico);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedTecnico(null);
    };

    const handleUpdate = async e => {
        e.preventDefault();
        await update(selectedTecnico.id, selectedTecnico);
        closeModal();
    };

    return (
        <main className="container mx-auto px-4">
            {/* Título */}
            <div className="text-center my-4 animacion">
                <h1 className="text-3xl font-bold text-white">Técnicos</h1>
            </div>

            {/* Pestañas */}
            <div className="flex flex-wrap justify-center mb-6 border-b border-white">
                <button
                    className={`cursor-pointer relative px-6 py-2 font-semibold -mb-px ${activeTab === 'tecnicos' ? 'text-[#168F27] border-b-4 border-[#168F27]' : 'text-white hover:text-[#168F27]'} transition-colors`}
                    onClick={() => setActiveTab('tecnicos')}
                >
                    Técnicos
                </button>
                <button
                    className={`cursor-pointer relative px-6 py-2 font-semibold -mb-px ${activeTab === 'agregar' ? 'text-[#168F27] border-b-4 border-[#168F27]' : 'text-white hover:text-[#168F27]'} transition-colors`}
                    onClick={() => setActiveTab('agregar')}
                >
                    Agregar técnico
                </button>
            </div>

            {/* Contenido: Lista de Técnicos */}
            {activeTab === 'tecnicos' && (
                <>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Buscar por nombre, especialidad o teléfono"
                                className="w-full pl-10 text-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400"
                            />
                        </div>
                        <button className="bg-[#168F27] text-white px-4 py-2 rounded-lg hover:bg-[#12701f] flex items-center gap-2 cursor-pointer" onClick={() => setSearch('')}>
                            <FiX className="text-lg" /> Limpiar
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-center text-white">Cargando...</p>
                    ) : filteredTecnicos.length === 0 ? (
                        <p className="text-center text-white text-lg">No hay técnicos registrados</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {filteredTecnicos.map(tecnico => (
                                <div key={tecnico.id} className="bg-gray-100 border border-gray-700 rounded-xl p-5 transition-all duration-300 ease-in-out hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 hover:-translate-y-1">
                                    <div className="flex flex-col h-full">
                                        <h3 className="text-xl font-bold text-black mb-2">{tecnico.nombre}</h3>
                                        <p><strong>Especialidad:</strong> {tecnico.especialidad}</p>
                                        <p><strong>Teléfono:</strong> {tecnico.telefono}</p>
                                        <div className="mt-4 flex gap-2">
                                            <button className="w-full bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1" onClick={() => openUpdateModal(tecnico)}>
                                                <FiEdit /> Actualizar
                                            </button>
                                            <button className="w-full bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 text-sm font-semibold transition-colors cursor-pointer" onClick={() => remove(tecnico.id)}>Eliminar</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Contenido: Agregar Técnico */}
            {activeTab === 'agregar' && (
                <div className="animacion max-w-md mx-auto">
                    <form onSubmit={agregarTecnico} className="flex flex-col gap-4 bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-center"> <FiUser className="text-6xl text-green-600" /> </div>
                        <div className="text-center mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Agregar Nuevo Técnico</h2>
                            <p className="text-gray-500 text-sm">Llena los datos a continuación</p>
                        </div>
                        <input type="text" name="nombre" value={newTecnico.nombre} onChange={handleAddChange} placeholder="Nombre" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]" required />
                        <input type="text" name="especialidad" value={newTecnico.especialidad} onChange={handleAddChange} placeholder="Especialidad" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]" required />
                        <input type="text" name="telefono" value={newTecnico.telefono} onChange={handleAddChange} placeholder="Teléfono" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]" required />
                        <div className="flex justify-end mt-2">
                            <button type="submit" className="bg-[#168F27] text-white px-4 py-2 rounded hover:bg-green-700 transition-colors cursor-pointer">Agregar</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Modal de actualización */}
            {isModalOpen && selectedTecnico && (
                <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Actualizar Técnico: {selectedTecnico.nombre}</h2>
                        <form onSubmit={handleUpdate} className="flex flex-col gap-3">
                            <input type="text" name="nombre" value={selectedTecnico.nombre} onChange={handleUpdateChange} placeholder="Nombre" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]" required />
                            <input type="text" name="especialidad" value={selectedTecnico.especialidad} onChange={handleUpdateChange} placeholder="Especialidad" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]" required />
                            <input type="text" name="telefono" value={selectedTecnico.telefono} onChange={handleUpdateChange} placeholder="Teléfono" className="border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#168F27]" required />
                            <div className="flex justify-end gap-2 mt-2">
                                <button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors">Cancelar</button>
                                <button type="submit" className="bg-[#168F27] text-white px-4 py-2 rounded hover:bg-green-700 transition-colors">Actualizar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Technicians;
