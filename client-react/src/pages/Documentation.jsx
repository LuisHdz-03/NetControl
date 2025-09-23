import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

// Iconos SVG personalizados
const FiFileText = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const FiUpload = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const FiDownload = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const FiPlus = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const FiEdit = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const FiTrash = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const FiClock = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const FiCalendar = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const FiFilter = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const Documentation = () => {
  const [activeTab, setActiveTab] = useState("historial");
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    categoria: '',
    estado: '',
    prioridad: ''
  });

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'historial',
    categoria: '',
    dispositivo_afectado: '',
    fecha_programada: '',
    estado: 'pendiente',
    prioridad: 'media',
    tecnico_id: '',
    archivos: []
  });

  // Estado para manejar archivos existentes en edición
  const [existingFiles, setExistingFiles] = useState([]);
  const [deletingFileIds, setDeletingFileIds] = useState([]);

  useEffect(() => {
    loadEntries();
    loadStats();
  }, [activeTab, filters]);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('tipo', activeTab);
      if (filters.categoria) params.append('categoria', filters.categoria);
      
      const response = await fetch(`http://localhost:5000/documentation?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        let filteredData = data;
        
        // Aplicar filtros adicionales
        if (filters.estado) {
          filteredData = filteredData.filter(entry => entry.estado === filters.estado);
        }
        if (filters.prioridad) {
          filteredData = filteredData.filter(entry => entry.prioridad === filters.prioridad);
        }
        
        setEntries(filteredData);
      } else {
        toast.error('Error al cargar documentación');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/documentation/stats');
      const data = await response.json();
      
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingEntry) {
        // Actualización de entrada existente
        const hasNewFiles = formData.archivos && formData.archivos.length > 0;
        
        if (hasNewFiles) {
          // Usar FormData si hay archivos nuevos
          const formDataToSend = new FormData();
          
          Object.keys(formData).forEach(key => {
            if (key !== 'archivos' && formData[key]) {
              formDataToSend.append(key, formData[key]);
            }
          });
          
          Array.from(formData.archivos).forEach(file => {
            formDataToSend.append('archivos', file);
          });
          
          const response = await fetch(`http://localhost:5000/documentation/${editingEntry.id}`, {
            method: 'PUT',
            body: formDataToSend
          });
          
          const result = await response.json();
          
          if (response.ok) {
            toast.success('Entrada actualizada exitosamente');
          } else {
            toast.error(result.error || 'Error al actualizar entrada');
            return;
          }
        } else {
          // Usar JSON si no hay archivos nuevos
          const updateData = { ...formData };
          delete updateData.archivos;
          
          const response = await fetch(`http://localhost:5000/documentation/${editingEntry.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData)
          });
          
          const result = await response.json();
          
          if (response.ok) {
            toast.success('Entrada actualizada exitosamente');
          } else {
            toast.error(result.error || 'Error al actualizar entrada');
            return;
          }
        }
      } else {
        // Creación de nueva entrada
        const formDataToSend = new FormData();
        
        Object.keys(formData).forEach(key => {
          if (key !== 'archivos' && formData[key]) {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        Array.from(formData.archivos).forEach(file => {
          formDataToSend.append('archivos', file);
        });
        
        const response = await fetch('http://localhost:5000/documentation', {
          method: 'POST',
          body: formDataToSend
        });
        
        const result = await response.json();
        
        if (response.ok) {
          toast.success('Entrada creada exitosamente');
        } else {
          toast.error(result.error || 'Error al crear entrada');
          return;
        }
      }
      
      // Si llegamos aquí, la operación fue exitosa
      setShowForm(false);
      resetForm();
      loadEntries();
      loadStats();
      
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descripcion: '',
      tipo: activeTab,
      categoria: '',
      dispositivo_afectado: '',
      fecha_programada: '',
      estado: 'pendiente',
      prioridad: 'media',
      tecnico_id: '',
      archivos: []
    });
    setEditingEntry(null);
    setExistingFiles([]);
    setDeletingFileIds([]);
  };

  const handleDeleteFile = async (fileId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este archivo?')) {
      setDeletingFileIds(prev => [...prev, fileId]);
      
      try {
        const response = await fetch(`http://localhost:5000/documentation/files/${fileId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Archivo eliminado exitosamente');
          // Actualizar la lista de archivos existentes
          setExistingFiles(prev => prev.filter(file => file.id !== fileId));
          loadEntries();
          loadStats();
        } else {
          const result = await response.json();
          toast.error(result.error || 'Error al eliminar archivo');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error de conexión');
      } finally {
        setDeletingFileIds(prev => prev.filter(id => id !== fileId));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      try {
        const response = await fetch(`http://localhost:5000/documentation/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Entrada eliminada');
          loadEntries();
          loadStats();
        } else {
          toast.error('Error al eliminar entrada');
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Error de conexión');
      }
    }
  };

  const downloadFile = async (fileId, filename) => {
    try {
      const response = await fetch(`http://localhost:5000/documentation/files/${fileId}`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Archivo descargado');
      } else {
        toast.error('Error al descargar archivo');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  };

  const getPriorityColor = (prioridad) => {
    const colors = {
      baja: 'bg-green-100 text-green-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      critica: 'bg-red-100 text-red-800'
    };
    return colors[prioridad] || colors.media;
  };

  const getStatusColor = (estado) => {
    const colors = {
      pendiente: 'bg-gray-100 text-gray-800',
      en_progreso: 'bg-blue-100 text-blue-800',
      completado: 'bg-green-100 text-green-800'
    };
    return colors[estado] || colors.pendiente;
  };

  const getTabIcon = (tab) => {
    switch (tab) {
      case 'historial': return <FiClock className="w-4 h-4" />;
      case 'proximo': return <FiCalendar className="w-4 h-4" />;
      case 'configuracion': return <FiFileText className="w-4 h-4" />;
      default: return <FiFileText className="w-4 h-4" />;
    }
  };

  return (
    <main className="container mx-auto p-4 animacion lineaSeparadora font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Documentación del Sistema</h1>
          <p className="text-gray-300">Historial de cambios, cambios próximos y configuraciones</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Entradas</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total_entradas || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Historial</h3>
            <p className="text-3xl font-bold text-green-600">{stats.historial || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Próximos</h3>
            <p className="text-3xl font-bold text-orange-600">{stats.proximos || 0}</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Archivos</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.total_archivos || 0}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="border-b">
            <nav className="-mb-px flex">
              {[
                { key: 'historial', label: 'Historial de Cambios' },
                { key: 'proximo', label: 'Cambios Próximos' },
                { key: 'configuracion', label: 'Configuraciones' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-6 py-3 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {getTabIcon(tab.key)}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Filtros */}
              <select
                value={filters.categoria}
                onChange={(e) => setFilters({...filters, categoria: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Todas las categorías</option>
                <option value="dispositivo">Dispositivo</option>
                <option value="red">Red</option>
                <option value="sistema">Sistema</option>
                <option value="seguridad">Seguridad</option>
              </select>

              <select
                value={filters.estado}
                onChange={(e) => setFilters({...filters, estado: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Todos los estados</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completado">Completado</option>
              </select>

              <select
                value={filters.prioridad}
                onChange={(e) => setFilters({...filters, prioridad: e.target.value})}
                className="border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Todas las prioridades</option>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>

            <button
              onClick={() => {
                setFormData({...formData, tipo: activeTab});
                setShowForm(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Nueva Entrada
            </button>
          </div>
        </div>

        {/* Entries List */}
        <div className="bg-white rounded-lg shadow-lg">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Cargando...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-8 text-center">
              <FiFileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay entradas en esta sección</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {entries.map(entry => (
                <div key={entry.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-gray-900">{entry.titulo}</h3>
                    <div className="flex gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(entry.prioridad)}`}>
                        {entry.prioridad}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(entry.estado)}`}>
                        {entry.estado}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{entry.descripcion}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                    <div>
                      <strong>Categoría:</strong> {entry.categoria || 'N/A'}
                    </div>
                    <div>
                      <strong>Dispositivo:</strong> {entry.dispositivo_afectado || 'N/A'}
                    </div>
                    <div>
                      <strong>Fecha:</strong> {new Date(entry.fecha_creacion).toLocaleDateString()}
                    </div>
                    {entry.fecha_programada && (
                      <div>
                        <strong>Programada:</strong> {new Date(entry.fecha_programada).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Archivos */}
                  {entry.archivos && entry.archivos.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Archivos adjuntos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {entry.archivos.map(archivo => (
                          <button
                            key={archivo.id}
                            onClick={() => downloadFile(archivo.id, archivo.nombre_original)}
                            className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                          >
                            <FiDownload className="w-3 h-3" />
                            {archivo.nombre_original}
                            <span className="text-xs text-gray-500">({archivo.tamaño_formateado})</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingEntry(entry);
                        setFormData({
                          ...entry,
                          fecha_programada: entry.fecha_programada ? entry.fecha_programada.split(' ')[0] : '',
                          archivos: []
                        });
                        setExistingFiles(entry.archivos || []);
                        setShowForm(true);
                      }}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FiEdit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-red-600 hover:text-red-800 flex items-center gap-1"
                    >
                      <FiTrash className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal del formulario */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">
                  {editingEntry ? 'Editar Entrada' : 'Nueva Entrada de Documentación'}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                      type="text"
                      value={formData.titulo}
                      onChange={(e) => setFormData({...formData, titulo: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                      value={formData.descripcion}
                      onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                      className="w-full border border-gray-300 rounded px-3 py-2 h-24"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                      <select
                        value={formData.categoria}
                        onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="">Seleccionar categoría</option>
                        <option value="dispositivo">Dispositivo</option>
                        <option value="red">Red</option>
                        <option value="sistema">Sistema</option>
                        <option value="seguridad">Seguridad</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dispositivo Afectado</label>
                      <input
                        type="text"
                        value={formData.dispositivo_afectado}
                        onChange={(e) => setFormData({...formData, dispositivo_afectado: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                        placeholder="Nombre del dispositivo"
                      />
                    </div>
                  </div>

                  {activeTab === 'proximo' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Programada</label>
                      <input
                        type="date"
                        value={formData.fecha_programada}
                        onChange={(e) => setFormData({...formData, fecha_programada: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                      <select
                        value={formData.estado}
                        onChange={(e) => setFormData({...formData, estado: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="pendiente">Pendiente</option>
                        <option value="en_progreso">En Progreso</option>
                        <option value="completado">Completado</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
                      <select
                        value={formData.prioridad}
                        onChange={(e) => setFormData({...formData, prioridad: e.target.value})}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                      >
                        <option value="baja">Baja</option>
                        <option value="media">Media</option>
                        <option value="alta">Alta</option>
                        <option value="critica">Crítica</option>
                      </select>
                    </div>
                  </div>

                  {/* Archivos existentes (solo al editar) */}
                  {editingEntry && existingFiles.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Archivos Actuales
                      </label>
                      <div className="space-y-2 mb-4">
                        {existingFiles.map(archivo => (
                          <div key={archivo.id} className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                            <div className="flex items-center gap-2">
                              <FiFileText className="w-4 h-4 text-gray-600" />
                              <span className="text-sm font-medium text-gray-900">{archivo.nombre_original}</span>
                              <span className="text-xs text-gray-500">({archivo.tamaño_formateado})</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => downloadFile(archivo.id, archivo.nombre_original)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                              >
                                <FiDownload className="w-3 h-3" />
                                Descargar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteFile(archivo.id)}
                                disabled={deletingFileIds.includes(archivo.id)}
                                className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm px-2 py-1 rounded hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <FiTrash className="w-3 h-3" />
                                {deletingFileIds.includes(archivo.id) ? 'Eliminando...' : 'Eliminar'}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subir nuevos archivos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {editingEntry ? 'Agregar Nuevos Archivos (Opcional)' : 'Archivos (PDF, TXT, DOC, etc.)'}
                    </label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.txt,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => setFormData({...formData, archivos: e.target.files})}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Máximo 16MB por archivo. Formatos: PDF, TXT, DOC, DOCX, JPG, PNG
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                      {editingEntry ? 'Actualizar' : 'Crear Entrada'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Documentation;