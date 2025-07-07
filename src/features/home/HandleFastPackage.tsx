import { useHandleFastPackage } from "@/features/home/handleFastPackage/hooks/useHandleFastPackage";
import { PackageForm } from "@/features/home/handleFastPackage/components/PackageForm";

export default function HandleFastPackage() {
  const {
    date,
    people,
    selectedPackageId,
    errors,
    isLoading,
    selectedPackage,
    availablePackages,
    getUnavailableDates,
    handlePackageChange,
    handleDateChange,
    handlePeopleChange,
    handleReservation,
  } = useHandleFastPackage();

  return (
    <div className="bg-primary rounded-xl shadow-lg z-40  text-center">
      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 border-b border-white/50 pb-2">
          <h2 className="text-xl font-bold text-white">
            🚀 Compra Rápida
          </h2>
          <p className="text-white/80 text-sm">
            Selecciona y compra tu paquete perfecto
          </p>
        </div>

        {/* Formulario principal */}
        <PackageForm
          people={people}
          selectedPackageId={selectedPackageId}
          availablePackages={availablePackages}
          selectedPackage={selectedPackage}
          date={date}
          errors={errors}
          isLoading={isLoading}
          onPeopleChange={handlePeopleChange}
          onPackageChange={handlePackageChange}
          onDateChange={handleDateChange}
          onReservation={handleReservation}
          getUnavailableDates={getUnavailableDates}
        />

        {/* <PackageInfo
          availablePackages={availablePackages}
          selectedPackage={selectedPackage}
          people={people}
          date={date}
          calculateTotalPrice={calculateTotalPrice}
        />

        <ErrorMessages
          errors={errors}
        /> */}
      </div>
    </div>
  );
}