import { useState } from 'react';
import PackageCard from '@/components/ui/cards/PackageCard';
import paquete1 from "@/assets/images/paquete1.webp";
import paquete2 from "@/assets/images/paquete2.webp";
import AnimatedTitle from '@/components/ui/display/AnimatedTitle';
import { Package } from '@/types';

const packages: Package[] = [
  {
    image: paquete1,
    title: "Recorrido Experiencia",
    price: "$45.000",
    category: "Educativo",
    description: "Los visitantes podrán disfrutar de una experiencia inmersiva y enriquecedora, diseñada para despertar su curiosidad y conectar con la naturaleza.",
    features: [
      "Guía especializado",
      "3 horas de recorrido",
      "Degustación de productos",
      "Souvenir de regalo"
    ],
    onClick: () => console.log("Recorrido Experiencia")
  },
  {
    image: paquete2,
    title: "Paquete Ruta Turistica",
    price: "$65.000",
    category: "Premium",
    description: "Una experiencia única donde cada detalle ha sido cuidadosamente diseñado para ofrecer momentos memorables en entornos naturales de ensueño.",
    features: [
      "Actividades personalizadas",
      "5 horas de experiencia",
      "Almuerzo incluido",
      "Transporte incluido"
    ],
    onClick: () => console.log("Paquete Personalizado")
  },
];

const PackageSelector = () => {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const filters = ['Todos', 'Educativo', 'Premium'];

  return (
    <div className="responsive-padding-x py-16">
      <div className="text-center pb-2">
        <AnimatedTitle
          title='NUESTROS PAQUETES'
          align="center"
          mdAlign="center"
        />
        <p className="text-gray-700 max-w-2xl mx-auto text-lg mt-2">
          Descubre experiencias únicas diseñadas para conectar con la naturaleza y la cultura local
        </p>
      </div>

      {/* Filtros */}
      <div className="flex justify-center gap-4 mb-8">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${activeFilter === filter
              ? 'bg-green-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid de paquetes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {packages
          .filter(pkg => activeFilter === 'Todos' || pkg.category === activeFilter)
          .map((pkg, index) => (
            <PackageCard
              key={index}
              image={pkg.image}
              title={pkg.title}
              description={pkg.description}
              price={pkg.price}
              features={pkg.features}
              category={pkg.category}
              onClick={pkg.onClick}
            />
          ))}

        <PackageCard
          title=""
          description=""
          onClick={() => console.log("Crear nuevo paquete")}
          isCreateCard
        />
      </div>
    </div>
  );
};

export default PackageSelector; 