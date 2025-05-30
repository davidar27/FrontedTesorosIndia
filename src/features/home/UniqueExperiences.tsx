import React from 'react';
import rioBarbas from '@/assets/images/cañonRioBarbas.webp';
import flores from '@/assets/images/paquete1.webp';
import gastronomiaImage from '@/assets/images/experincia3.webp';
import AnimatedTitle from '@/components/ui/display/AnimatedTitle';

const UniqueExperiences: React.FC = () => {
  const experiences = [
    {
      title: "Sumérgete en Ríos y Bosques Mágicos",
      description: "Vive la belleza del campo con caminatas a través de ríos, quebradas y bosques nativos, descubriendo la biodiversidad mientras te conectas con la naturaleza.",
      image: rioBarbas,
      color: "from-secondary to-tertiary",
      hoverColor: "primary",
      delay: "delay-100"
    },
    {
      title: "Descubre la Magia de la Agricultura",
      description: "Aprende sobre la práctica de la agricultura tanto agroecológica como convencional, entendiendo los métodos sostenibles y la producción local.",
      image: flores,
      color: "from-tertiary to-primary",
      hoverColor: "white",
      delay: "delay-200"
    },
    {
      title: "Un Viaje Gastronómico a la Tradición",
      description: "Disfruta y aprende sobre los alimentos ancestrales de la región, explorando su importancia cultural y su preparación tradicional.",
      image: gastronomiaImage,
      color: "from-primary to-secondary",
      hoverColor: "tertiary",
      delay: "delay-300"
    }
  ];

  return (
    <section className="responsive-padding-y responsive-padding-x  bg-gradient-to-b from-green-50 to-white ">
      <div className="max-w-7xl mx-auto">
        <AnimatedTitle
          title="Experiencias únicas"
          className="mb-12"
          mdAlign='center'
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 animate-fade-in-up ${exp.delay}`}
            >
              {/* Fondo con imagen */}
              <div className="absolute inset-0">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-br ${exp.color} opacity-70 group-hover:opacity-80 transition-opacity duration-300`}></div>
              </div>

              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Contenedor de imagen */}
                <div className="w-20 h-20 mb-6 overflow-hidden rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </div>

                <h2 className={`text-2xl font-bold text-white mb-4 group-hover:text-${exp.hoverColor}  transition-colors duration-300`}>
                  {exp.title}
                </h2>

                <p className="text-white mb-6 flex-grow">
                  {exp.description}
                </p>
              </div>

              {/* Elementos decorativos */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full transform -translate-x-12 translate-y-12 group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UniqueExperiences;