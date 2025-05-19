import React from 'react';
import Grupo from '@/assets/images/Grupo.png';

const Us: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center  ">
      <div className="flex md:flex-row items-center justify-between max-w-6xl w-full text-white">
        {/* Texto */}
        <div className="max-w-xl mb-8 md:mb-0">
          <h2 className="text-[64px] font-bold mb-4 text-center"> Sobre Nosotros </h2>
          <p className="text-[24px] text-center">
            Somos un grupo dedicado a conservar el territorio, promover el turismo rural y mejorar los ingresos de las familias campesinas de manera sostenible.
          </p>
        </div>

        {/* Imagen de grupo */}
        <div className="md:block rounded-xl w-[450px]">
          <img
            src={Grupo}
            alt="Grupo"
            className="w-full h-full object-cover" />
        </div>
      </div>
    </div >
  );
};

export default Us;
