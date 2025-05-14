import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import PackageSelector from "@/components/home/PackageSelector";
import TouristRoute from "@/components/home/TouristRoute";
import UniqueExperiences from "@/components/home/UniqueExperiences";
import Leaders from "@/components/home/Leaders";
import History from "@/components/home/History";
import { useAuth } from '@/context/useAuth';

const Home: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (!isLoading && !isAuthenticated) {
      console.log("Usuario no autenticado viendo la página de inicio");
    }
  }, [isAuthenticated, isLoading]);

  return (
    <div className="bg-white text-gray-800">
      <main>
        <Hero />

        {isAuthenticated && (
          <div className="bg-green-100 p-4 text-center">
            Bienvenido de vuelta, {user?.name}!
          </div>
        )}

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