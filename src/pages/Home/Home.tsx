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
              `w-full z-50 mx-auto transition-all duration-300 ease-in 
              md:absolute md:top-1/2 md:-translate-y-1/3 md:left-1/2 md:-translate-x-1/2 md:px-8
              lg:top-1/2   lg:-translate-y-1/8 lg:max-w-4xl  lg:px-0
              xl:-translate-y-1/3 xl:max-w-5xl
              2xl:-translate-y-1/2  2xl:max-w-6xl
              3xl:-translate-y-1/4 3xl:max-w-7xl`
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
