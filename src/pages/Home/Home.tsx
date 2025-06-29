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
    }, 300);
  }, []);


  const useMediaQuery = (query: string): boolean => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      const listener = () => setMatches(media.matches);
      listener();

      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }, [query]);

    return matches;
  };


  const isLarge = useMediaQuery('(min-width: 1024px)');

  return (
    <section>
      <div className="relative">
        <Hero />
        {!isLoading && (
          <div
            className={clsx(
              "w-full max-w-5xl mx-auto px-4 z-20 transition-all duration-800",
              isLarge && "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in"
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
