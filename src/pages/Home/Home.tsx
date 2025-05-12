import { useEffect } from "react";
import Hero from "@/components/home/Hero";
import PackageSelector from "@/components/home/PackageSelector";
import TouristRoute from "@/components/home/TouristRoute";
import UniqueExperiences from "@/components/home/UniqueExperiences";
import Leaders from "@/components/home/Leaders";
import History from "@/components/home/History";

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
