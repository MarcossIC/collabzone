import React from 'react';
import error404img from '/images/error404.png';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-16 px-6 py-28 md:px-24 md:py-20 lg:flex-row lg:gap-28 lg:py-32">
      <div className="w-full lg:w-1/2">
        <img
          className="w-full max-w-xs md:max-w-md lg:max-w-lg"
          src={error404img}
          alt="No encontrado"
        />
      </div>
      <div className="w-full lg:w-1/2">
        <h1 className="py-4 text-3xl font-extrabold text-gray-800 lg:text-4xl">
          Parece que has encontrado la puerta a la gran nada
        </h1>
        <p className="py-4 text-base text-gray-800">
          El contenido que estás buscando no existe. O fue eliminado, o escribiste
          mal el enlace.
        </p>
        <p className="py-2 text-base text-gray-800">
          ¡Lo sentimos! Por favor, visita nuestra página principal para llegar a
          donde necesitas ir.
        </p>
        <button className="bg-customBlue my-4 w-full rounded-md border px-1 py-5 text-white hover:bg-indigo-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-800/50 sm:px-16 lg:w-auto">
          <Link to="home">Volver al Home</Link>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
