import { useEffect, useState } from 'react';
import PackageCard from '@/components/ui/cards/PackageCard';
import AnimatedTitle from '@/components/ui/display/AnimatedTitle';
import { Package } from '@/types';
import { PackagesApi } from '@/services/home/packages';


const PackageSelector = () => {
  const [packages, setPackages] = useState<Package[]>([])

  useEffect(() => {
    const fetchPackages = async () => {
      const dataPackages: Package[] = await PackagesApi.getPackages();
      setPackages(dataPackages);
    }
    fetchPackages()
  }, [])

  return (
    <div className="responsive-padding-x pt-20 ">
      <div className="text-center pb-6">
        <AnimatedTitle
          title='NUESTROS PAQUETES'
          align="center"
          mdAlign="center"
        />
        <p className="text-gray-700 max-w-2xl mx-auto text-lg mt-2">
          Descubre experiencias únicas diseñadas para conectar con la naturaleza y la cultura local
        </p>
      </div>


      {/* Grid de paquetes */}
      <div className={`grid gap-6 justify-items-center ${packages.length === 1
          ? 'grid-cols-1'
          : packages.length === 2
            ? 'grid-cols-1 md:grid-cols-2'
            : packages.length === 3
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
        }`}
      >
        {packages
          .map((pkg, index) => {
            const features: string[] = [];
            if (pkg.has_food) features.push("Incluye Comida");
            return (< PackageCard
              key={index}
              id={pkg.package_id}
              image={pkg.image}
              title={pkg.title}
              description={pkg.description}
              price={pkg.price}
              features={features}
              onClick={pkg.onClick}
            />)
          })}
      </div>
    </div>
  );
};

export default PackageSelector; 