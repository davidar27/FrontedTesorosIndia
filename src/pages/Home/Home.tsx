import Hero from "@/features/home/Hero";
import PackageSelector from "@/features/home/PackageSelector";
import TouristRoute from "@/features/home/map/TouristRoute";
import UniqueExperiences from "@/features/home/UniqueExperiences";
import Leaders from "@/features/home/Leaders";
import HandleFastPackage from "@/features/home/HandleFastPackage";
import { useEffect, useState } from "react";
import clsx from "clsx";



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
            className={clsx(
              "w-full max-w-5xl mx-auto pt-4 px-4 z-20 transition-all duration-300 ease-in",
              "lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 "
            )}
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
