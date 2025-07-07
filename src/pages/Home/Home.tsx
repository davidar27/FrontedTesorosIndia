import Hero from "@/features/home/Hero";
import PackageSelector from "@/features/home/PackageSelector";
import TouristRoute from "@/features/home/map/TouristRoute";
import UniqueExperiences from "@/features/home/UniqueExperiences";
import Leaders from "@/features/home/Leaders";
import HandleFastPackage from "@/features/home/HandleFastPackage";
import { useEffect, useState } from "react";



const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 250);
  }, []);
  return (
    <section>
      <div className="relative">
        <Hero />
        {!isLoading && (
          <div
            className={
              `w-full z-40 mx-auto transition-all duration-300 ease-in md:h-0 flex justify-center items-center`
            }
          >
            <HandleFastPackage />
          </div>
        )}
        <PackageSelector />
      </div>
      <TouristRoute />
      <UniqueExperiences />
      <Leaders />
    </section>
  );
};

export default Home;
