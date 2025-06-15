import { useEffect, useState } from 'react';
import PackageCard from '@/components/ui/cards/PackageCard';
import AnimatedTitle from '@/components/ui/display/AnimatedTitle';
import { Package } from '@/types';
import { PackagesApi } from '@/services/home/packages';


const PackageSelector = () => {
  const [packages, setPackages] = useState<Package[]>([])
  const [activeFilter, setActiveFilter] = useState('Todos');
  const filters = ['Todos', 'Educativo', 'Premium'];

  useEffect(() => {
    const fetchPackages = async () => {
      const dataPackages: any = await PackagesApi.getPackages();
      setPackages(dataPackages);
    }
    fetchPackages()
  }, [])

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
          // .filter(pkg => activeFilter === 'Todos' || pkg.category === activeFilter)
          .map((pkg, index): any => {
            const features: string[] = [];
            if (pkg.has_food) features.push("Incluye Comida");
            return (< PackageCard
              key={index}
              image={pkg.image}
              title={pkg.title}
              description={pkg.description}
              price={pkg.price}
              features={features}
              category={pkg.category}
              onClick={pkg.onClick}
            />)
          })}

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