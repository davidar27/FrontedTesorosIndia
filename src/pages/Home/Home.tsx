import { useEffect } from "react";
import Hero from "@/features/Home/components/Hero";
import PackageSelector from "@/features/Home/components/PackageSelector";
import TouristRoute from "@/features/Home/components/TouristRoute";
import UniqueExperiences from "@/features/Home/components/UniqueExperiences";
import Leaders from "@/features/Home/components/Leaders";
import History from "@/features/Home/components/History";

const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white text-gray-800">
      <main>

        <Hero />
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
