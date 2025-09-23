import React, { useState } from "react";
import { useFallas } from "../hooks/useFailures.js";
import { useTecnicos } from "../hooks/useTechnicians.js";
import { useInventory } from "../hooks/useInventory.js";
import {
    FiRefreshCw,
    FiAlertCircle,
    FiSearch,
    FiX,
    FiEdit,
    FiPlusCircle,
    FiUser,
    FiCpu,
    FiClock,
    FiFileText,
    FiUserPlus,
    FiHardDrive,
    FiChevronRight,
} from "react-icons/fi";

// Flujo de trabajo para los estados de las fallas
const STATUS_WORKFLOW = ["pendiente", "en proceso", "resuelta"];

const Failures = () => {
    const { fallas, loading, add, remove, update } = useFallas();
    const { tecnicos } = useTecnicos();
    const { activeUnits } = useInventory();

    const [activeTab, setActiveTab] = useState("vista");
    const [search, setSearch] = useState("");
    const [newFalla, setNewFalla] = useState({
        descripcion: "", cliente: "", prioridad: "media", notas: "",
        tecnico_id: "", unidad_id: "",
    });
    const [editingFalla, setEditingFalla] = useState(null);

    const handleChange = (e) =>
        setNewFalla({ ...newFalla, [e.target.name]: e.target.value });

    const handleEditChange = (e) =>
        setEditingFalla({ ...editingFalla, [e.target.name]: e.target.value });

    const handleAdd = async (e) => {
        e.preventDefault();

        // Validación básica
        if (!newFalla.descripcion.trim()) {
            alert("La descripción es obligatoria");
            return;
        }

        if (!newFalla.cliente.trim()) {
            alert("El nombre del cliente es obligatorio");
            return;
        }

        try {
            await add(newFalla);

            setNewFalla({
                descripcion: "", cliente: "", prioridad: "media", notas: "",
                tecnico_id: "", unidad_id: "",
            });
            setActiveTab("vista");
        } catch (error) {
            console.error("Error al agregar falla:", error);
            alert("Error al agregar la falla: " + error.message);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        await update(editingFalla.id, editingFalla);
        setEditingFalla(null);
    };

    const handleAdvanceState = async (falla) => {
        const currentIndex = STATUS_WORKFLOW.indexOf(falla.estado);
        if (currentIndex < STATUS_WORKFLOW.length - 1) {
            const nextState = STATUS_WORKFLOW[currentIndex + 1];
            await update(falla.id, { ...falla, estado: nextState });
        }
    };

    const filteredFallas = fallas.filter((f) =>
        f.descripcion.toLowerCase().includes(search.toLowerCase()) ||
        f.cliente.toLowerCase().includes(search.toLowerCase())
    );

    const getTecnicoInfo = (id) => {
        const t = tecnicos.find((tec) => tec.id === parseInt(id));
        if (!t) return <span className="text-gray-500">Sin asignar</span>;
        return (
            <div className="ml-1 text-sm">
                <p><strong>Nombre:</strong> {t.nombre}</p>
                <p><strong>Especialidad:</strong> {t.especialidad || "No disponible"}</p>
                <p><strong>Teléfono:</strong> {t.telefono || "No disponible"}</p>
            </div>
        );
    };

    const getUnidadInfo = (id) => {
        const u = activeUnits.find((unit) => unit.id === parseInt(id));
        if (!u) return <span className="text-gray-500">No asignado</span>;
        return (
            <div className="ml-1 text-sm">
                <p><strong>Nombre:</strong> {u.nombre}</p>
                <p><strong>Modelo:</strong> {u.modelo}</p>
                <p><strong>No. Serie:</strong> {u.noSerie}</p>
                <p><strong>Ubicación:</strong> {u.ubicacion}</p>
            </div>
        );
    };

    const getPriorityIcon = (prioridad) => {
        switch (prioridad) {
            case "critica": return <FiAlertCircle className="text-red-600 text-2xl" />;
            case "alta": return <FiAlertCircle className="text-orange-600 text-2xl" />;
            case "media": return <FiClock className="text-yellow-500 text-2xl" />;
            case "baja": return <FiClock className="text-green-500 text-2xl" />;
            default: return <FiAlertCircle className="text-gray-500 text-2xl" />;
        }
    };

    const getStatusBadge = (estado) => {
        const baseClasses = "font-semibold px-2 py-1 rounded-md text-sm capitalize";
        switch (estado) {
            case "pendiente": return <span className={`${baseClasses} bg-yellow-200 text-yellow-800`}>{estado}</span>;
            case "en proceso": return <span className={`${baseClasses} bg-blue-200 text-blue-800`}>{estado}</span>;
            case "resuelta": return <span className={`${baseClasses} bg-green-200 text-green-800`}>{estado}</span>;
            default: return <span className={`${baseClasses} bg-gray-300 text-gray-800`}>{estado}</span>;
        }
    };

    return (
        <main className="container mx-auto p-4 sm:p-6">
            <div className="text-center my-4">
                <h1 className="text-3xl font-bold text-white">Gestión de Fallas</h1>
            </div>

            <div className="flex flex-wrap justify-center mb-6 border-b border-white">
                <button className={`cursor-pointer px-6 py-2 font-semibold ${activeTab === "vista" ? "text-[#168F27] border-b-4 border-[#168F27]" : "text-white hover:text-[#168F27]"}`} onClick={() => setActiveTab("vista")}>Ver Fallas</button>
                <button className={`cursor-pointer px-6 py-2 font-semibold ${activeTab === "agregar" ? "text-[#168F27] border-b-4 border-[#168F27]" : "text-white hover:text-[#168F27]"}`} onClick={() => setActiveTab("agregar")}>Agregar Falla</button>
            </div>

            {activeTab === "vista" && (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 items-center">
                        <div className="bg-gray-300 shadow-lg rounded-xl p-4 flex items-center justify-center gap-4">
                            <FiAlertCircle className="text-red-600 text-4xl" />
                            <div className="flex items-baseline gap-2">
                                <p className="text-black font-bold text-2xl">{fallas.length}</p>
                                <p className="text-gray-700 font-medium text-lg">Fallas Registradas</p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex items-center gap-2 flex-1">
                                <div className="relative flex-1">
                                    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                                    <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 text-white border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder-gray-400" placeholder="Buscar por descripción o cliente..." />
                                </div>
                                <button className="bg-[#168F27] text-white px-4 py-2 rounded-lg hover:bg-[#12701f] flex items-center gap-2 cursor-pointer" onClick={() => setSearch('')}><FiX className="text-lg" />Limpiar</button>
                            </div>
                        </div>
                    </div>
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <FiRefreshCw className="animate-spin h-8 w-8 text-[#168F27] mr-2" />
                            <span className="text-white">Cargando fallas...</span>
                        </div>
                    ) : filteredFallas.length === 0 ? (
                        <div className="text-center py-16">
                            <FiAlertCircle className="mx-auto text-6xl text-gray-500 mb-4" />
                            <p className="text-center text-white text-xl">No se encontraron fallas</p>
                            <p className="text-gray-400">Intenta con otra búsqueda o agrega una nueva falla.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredFallas.map((falla) => (
                                <div key={falla.id} className="bg-gray-100 border border-gray-700 rounded-xl p-5 transform transition-transform duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/10 flex flex-col">
                                    <div className="flex items-center gap-3 mb-4">
                                        {getPriorityIcon(falla.prioridad)}
                                        <h3 className="text-xl font-bold text-black truncate">{falla.descripcion}</h3>
                                    </div>
                                    <div className="space-y-3 text-gray-700 flex-grow">
                                        <div className="flex items-start gap-3"><FiUser className="mt-1 text-gray-500" /><span><strong>Cliente:</strong> {falla.cliente}</span></div>
                                        <div className="flex items-start gap-3"><FiCpu className="mt-1 text-gray-500" /><div><strong>Dispositivo:</strong> {getUnidadInfo(falla.unidad_id)}</div></div>
                                        <div className="flex items-start gap-3"><FiUser className="mt-1 text-gray-500" /><div><strong>Técnico:</strong> {getTecnicoInfo(falla.tecnico_id)}</div></div>
                                        <p><strong>Estado:</strong> {getStatusBadge(falla.estado)}</p>
                                        <p><strong>Prioridad:</strong> <span className="capitalize">{falla.prioridad}</span></p>
                                    </div>
                                    <div className="mt-6 grid grid-cols-3 gap-2">
                                        <button className="col-span-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer transition-colors" onClick={() => setEditingFalla(falla)}><FiEdit /></button>
                                        <button className="col-span-1 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 text-sm font-semibold cursor-pointer transition-colors" onClick={() => remove(falla.id)}><FiX /></button>
                                        <button disabled={falla.estado === 'resuelta'} onClick={() => handleAdvanceState(falla)} className="col-span-1 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 flex items-center justify-center gap-1 text-sm font-semibold cursor-pointer transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"><FiChevronRight /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {activeTab === "agregar" && (
                <form onSubmit={handleAdd} className="max-w-3xl mx-auto grid gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FiFileText /> Información de la falla</h2>
                        <textarea name="descripcion" value={newFalla.descripcion} onChange={handleChange} placeholder="Titulo de la falla" className="border px-3 py-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[#168F27]" required />
                        <input type="text" name="cliente" value={newFalla.cliente} onChange={handleChange} placeholder="Nombre del cliente" className="border px-3 py-2 rounded w-full mb-3 focus:outline-none focus:ring-2 focus:ring-[#168F27]" required />
                        <select name="prioridad" value={newFalla.prioridad} onChange={handleChange} className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#168F27]">
                            <option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option><option value="critica">Crítica</option>
                        </select>
                        <textarea name="notas" value={newFalla.notas} onChange={handleChange} placeholder="Notas adicionales" className="border px-3 py-2 rounded w-full mt-3 focus:outline-none focus:ring-2 focus:ring-[#168F27]" />
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FiUserPlus /> Asignar técnico</h2>
                        <select name="tecnico_id" value={newFalla.tecnico_id} onChange={handleChange} className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#168F27] cursor-pointer">
                            <option value="">-- Selecciona Técnico --</option>
                            {tecnicos.map((t) => (<option key={t.id} value={t.id}>{t.nombre}</option>))}
                        </select>
                        {newFalla.tecnico_id && (<div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 rounded-r-lg"><h3 className="font-bold text-base mb-2 text-gray-800">Información del Técnico:</h3>{getTecnicoInfo(newFalla.tecnico_id)}</div>)}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FiHardDrive /> Dispositivo afectado</h2>
                        <select name="unidad_id" value={newFalla.unidad_id} onChange={handleChange} className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#168F27] cursor-pointer">
                            <option value="">-- Selecciona Dispositivo Activo --</option>
                            {activeUnits.map((u) => (<option key={u.id} value={u.id}>{u.nombre} - {u.ubicacion}</option>))}
                        </select>
                        {newFalla.unidad_id && (<div className="mt-4 p-4 bg-blue-100 border-l-4 border-blue-500 rounded-r-lg"><h3 className="font-bold text-base mb-2 text-gray-800">Información del Dispositivo:</h3>{getUnidadInfo(newFalla.unidad_id)}</div>)}
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className="bg-[#168F27] text-white px-4 py-2 rounded hover:bg-green-700 transition-colors cursor-pointer flex items-center gap-2"><FiPlusCircle className="inline mr-1" /> Agregar Falla</button>
                    </div>
                </form>
            )}

            {editingFalla && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
                        <button className="absolute top-3 right-3 text-black hover:text-gray-800 text-3xl cursor-pointer font-bold" onClick={() => setEditingFalla(null)}>&times;</button>
                        <h2 className="text-2xl font-bold mb-6 text-gray-800">Editando Falla</h2>
                        <form onSubmit={handleUpdate} className="grid gap-6">
                            {/* Formulario de edición completo */}
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-700"><FiFileText /> Detalles de la Falla</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-600 mb-1">Descripción</label><input type="text" name="descripcion" value={editingFalla.descripcion} onChange={handleEditChange} className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#168F27]" required /></div>
                                    <div><label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label><input type="text" name="cliente" value={editingFalla.cliente} onChange={handleEditChange} className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#168F27]" required /></div>
                                    <div><label className="block text-sm font-medium text-gray-600 mb-1">Prioridad</label><select name="prioridad" value={editingFalla.prioridad} onChange={handleEditChange} className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#168F27] cursor-pointer"><option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option><option value="critica">Crítica</option></select></div>
                                    <div><label className="block text-sm font-medium text-gray-600 mb-1">Estado</label><select name="estado" value={editingFalla.estado} onChange={handleEditChange} className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#168F27] cursor-pointer"><option value="pendiente">Pendiente</option><option value="en proceso">En Proceso</option><option value="resuelta">Resuelta</option></select></div>
                                </div>
                                <div className="mt-4"><label className="block text-sm font-medium text-gray-600 mb-1">Notas Adicionales</label><textarea name="notas" value={editingFalla.notas || ''} onChange={handleEditChange} className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#168F27]" /></div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg border">
                                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-gray-700"><FiUserPlus /> Asignaciones</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-medium text-gray-600 mb-1">Técnico Asignado</label><select name="tecnico_id" value={editingFalla.tecnico_id || ''} onChange={handleEditChange} className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#168F27] cursor-pointer"><option value="">-- Sin Asignar --</option>{tecnicos.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}</select></div>
                                    <div><label className="block text-sm font-medium text-gray-600 mb-1">Dispositivo Afectado</label><select name="unidad_id" value={editingFalla.unidad_id || ''} onChange={handleEditChange} className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-[#168F27] cursor-pointer"><option value="">-- Sin Asignar --</option>{activeUnits.map(u => <option key={u.id} value={u.id}>{u.nombre}</option>)}</select></div>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-4">
                                <button type="button" onClick={() => setEditingFalla(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer">Cancelar</button>
                                <button type="submit" className="bg-[#168F27] text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors cursor-pointer flex items-center gap-2"><FiEdit /> Guardar Cambios</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
};

export default Failures;

