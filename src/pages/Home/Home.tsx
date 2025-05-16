import Hero from "@/components/home/Hero";
import PackageSelector from "@/components/home/PackageSelector";
import TouristRoute from "@/components/home/TouristRoute";
import UniqueExperiences from "@/components/home/UniqueExperiences";
import Leaders from "@/components/home/Leaders";
import History from "@/components/home/History";
import HandleReservation from "@/components/home/HandleReservation";
import { useAuth } from "@/context/useAuth";

const Home: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className=" text-gray-800">
      <main>
        <Hero />

        {isAuthenticated && (
          <div className="bg-green-100 p-4 text-center">
            Bienvenido de vuelta, {user?.name}!
          </div>
        )}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] max-w-5xl">
          <HandleReservation />
        </div>
        <section className="px-4 md:px-16 py-10 bg-gray-500">
          <PackageSelector />
        </section>

        <section className="px-4 md:px-16 py-10 bg-gray-50">
          <TouristRoute />
        </section>

        <section className="px-4 md:px-16 py-10">
          <UniqueExperiences />
        </section>

        <section className="px-4 md:px-16 py-10 bg-gray-50">
          <Leaders />
        </section>

        <section className="px-4 md:px-16 py-10">
          <History />
        </section>
      </main>
    </div>
  );
};

export default Home;
