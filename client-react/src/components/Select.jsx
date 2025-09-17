import { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa'; // Importamos el ícono

export default function CustomSelect({ name, value, onChange, options }) {
  const [isOpen, setIsOpen] = useState(false);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {/* Botón Select simulado */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left border px-3 py-2 rounded flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-[#168F27] bg-white"
      >
        <span>{value || "Selecciona..."}</span>

        <FaChevronDown
          className={`text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Menú desplegable */}
      {isOpen && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <li
              key={option.value}
              onMouseDown={() => {
                onChange({ target: { name, value: option.value } });
                setIsOpen(false);
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-[#168F27] hover:text-white ${
                value === option.value ? 'bg-green-100 text-[#168F27] font-medium' : ''
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}

      {/* Input oculto para formularios */}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}