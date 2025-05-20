import { PackageCard } from '@/components/ui/cards/PackageCard';

const PackageSelector = () => {
  return (
    <div className="text-center my-8">
      <h2 className="text-3xl font-bold text-green-700">ESCOJA SU PAQUETE</h2>
      <p className="text-gray-700 mt-1">Seleccione el Mejor Paquete para su Viaje</p>

      <div className="mt-8 flex flex-wrap justify-center gap-6">
        <PackageCard
          image="/ruta/recorrido-finca.jpg"
          title="Recorrido Finca"
          description="Los visitantes podrán disfrutar de una experiencia inmersiva y enriquecedora, diseñada para despertar su curiosidad."
          onClick={() => console.log("Recorrido Finca")}
        />

        <PackageCard
          image="/ruta/paquete-personalizado.jpg"
          title="Paquete Personalizado"
          description="Además, se han implementado iniciativas innovadoras que aseguran una experiencia única, donde cada detalle ha sido ."
          onClick={() => console.log("Paquete Personalizado")}
        />

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
