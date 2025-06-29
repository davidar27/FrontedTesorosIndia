import { useEffect, useState } from 'react';
import PackageCard from '@/components/ui/cards/PackageCard';
import AnimatedTitle from '@/components/ui/display/AnimatedTitle';
import { PackageData } from '@/features/packages/types/packagesTypes';
import { PackagesApi } from '@/services/home/packages';

const PackageCardSkeleton = () => {
  return (
    <div className="w-full max-w-xs rounded-lg bg-white p-4 shadow animate-pulse space-y-3">
      <div className="h-40 bg-gray-300 rounded-lg" />
      <div className="h-4 bg-gray-300 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-2/4" />
      <div className="h-3 bg-gray-200 rounded w-4/5" />
      <div className="h-10 bg-gray-300 rounded mt-4" />
    </div>
  );
};


const PackageSelector = () => {
  const [packages, setPackages] = useState<PackageData[]>([])

  useEffect(() => {
    const fetchPackages = async () => {
      const dataPackages: PackageData[] = await PackagesApi.getPackages();
      setPackages(dataPackages);
    }
    fetchPackages()
  }, [])

  return (
    <div className="responsive-padding-x pt-12 lg:pt-60">
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
        {packages.length === 0
          ? Array.from({ length: 4 }).map((_, idx) => <PackageCardSkeleton key={idx} />)
          : packages.map((pkg, index) => (
            <PackageCard
              key={index}
              id={pkg.package_id}
              image={pkg.image}
              name={pkg.name}
              description={pkg.description}
              price={pkg.price}
              details={pkg.details || []}
              onClick={() => { }}
            />
          ))}
      </div>
    </div>
  );
};

export default PackageSelector; 