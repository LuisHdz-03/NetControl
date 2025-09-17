import React from 'react';

const Home = () => {
  const iniciarPrueba = () => {
    // Aquí puedes colocar la lógica de la prueba de velocidad
    console.log("Prueba iniciada");
  };

  return (
    <main className="container mx-auto p-4 animacion lineaSeparadora font-sans">
      <div className="text-center my-4">
        <h1 className="text-3xl font-bold text-white">Bienvenido a la página de Inicio</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta de ancho de banda */}
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-sm flex flex-col">
            <div className="p-6 text-center flex flex-col flex-1">
              <h5 className="text-xl font-semibold mb-2">ANCHO DE BANDA</h5>
              <p className="mb-1">Velocidad de descarga: <span id="download">-</span> Mbps</p>
              <p className="mb-1">Velocidad de subida: <span id="upload">-</span> Mbps</p>
              <p className="mb-4">Ping: <span id="ping">-</span> ms</p>
              <button 
                className="bg-blue-600 text-white py-2 px-4 rounded mt-auto hover:bg-blue-700"
                onClick={iniciarPrueba}
              >
                Iniciar Prueba
              </button>
            </div>
          </div>
        </div>

        {/* Tarjeta de estado de la red */}
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-sm flex flex-col">
            <div className="p-6 text-center flex flex-col flex-1">
              <h5 className="text-xl font-semibold mb-2">ESTADO DE LA RED</h5>
              <p className="text-green-600 mb-4">ÓPTIMA</p>
              <a 
                href="Ajustes.html" 
                className="bg-gray-800 text-white py-2 px-4 rounded mt-auto hover:bg-gray-900"
              >
                Detalles
              </a>
            </div>
          </div>
        </div>

        {/* Tarjeta de mantenimiento */}
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-sm flex flex-col">
            <div className="p-6 text-center flex flex-col flex-1">
              <h5 className="text-xl font-semibold mb-2">MANTENIMIENTO</h5>
              <p className="text-red-600 mb-4" id="numero-fallas">Cargando...</p>
              <a 
                href="Fallas.html" 
                className="bg-gray-800 text-white py-2 px-4 rounded mt-auto hover:bg-gray-900"
              >
                Detalles
              </a>
            </div>
          </div>
        </div>

        {/* Tarjeta de dispositivos conectados */}
        <div className="flex justify-center">
          <div className="bg-white shadow-lg rounded-lg w-full max-w-sm flex flex-col">
            <div className="p-6 text-center flex flex-col flex-1">
              <h5 className="text-xl font-semibold mb-2">DISPOSITIVOS CONECTADOS</h5>
              <p className="mb-4"><strong id="dispositivos-conectados">Espere...</strong></p>
              <a 
                href="Dispositivos.html" 
                className="bg-gray-800 text-white py-2 px-4 rounded mt-auto hover:bg-gray-900"
              >
                Detalles
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
