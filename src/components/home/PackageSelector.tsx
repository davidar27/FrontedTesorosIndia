import { useState } from 'react';
import { motion } from 'framer-motion';
import PackageCard from '../ui/cards/PackageCard';
import paquete1 from "@/assets/images/paquete1.webp"
import paquete2 from "@/assets/images/paquete2.webp"


const PackageSelector = () => {
  const packages = [
    {
      image: paquete1,
      title: "Recorrido Finca",
      price: "$45.000",
      category: "Educativo",
      description: "Los visitantes podrán disfrutar de una experiencia inmersiva y enriquecedora, diseñada para despertar su curiosidad y conectar con la naturaleza.",
      features: [
        "Guía especializado",
        "3 horas de recorrido",
        "Degustación de productos",
        "Souvenir de regalo"
      ],
      onClick: () => console.log("Recorrido Finca")
    },
    {
      image: paquete2,
      title: "Paquete Personalizado",
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

  const [activeFilter, setActiveFilter] = useState('Todos');
  const filters = ['Todos', 'Educativo', 'Premium'];

  return (
    <div className="responsive-padding-x responsive-padding-y">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          
          <h2 className="text-4xl font-bold text-green-700 mb-4">ESCOJA SU PAQUETE</h2>
          <div className="w-24 h-1 bg-green-600 mx-auto rounded mb-6"></div>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg">
            Seleccione el mejor paquete para su viaje y disfrute de una experiencia inolvidable en contacto con la naturaleza
          </p>

          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {filters.map(filter => (
              <motion.button
                key={filter}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeFilter === filter
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                onClick={() => setActiveFilter(filter)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
              >
                {filter}
              </motion.button>
            ))}
          </div>
        </motion.div>

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
    </div>
  );
};

export default PackageSelector;