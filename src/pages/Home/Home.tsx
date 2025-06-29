import Hero from "@/features/home/Hero";
import PackageSelector from "@/features/home/PackageSelector";
import TouristRoute from "@/features/home/map/TouristRoute";
import UniqueExperiences from "@/features/home/UniqueExperiences";
import Leaders from "@/features/home/Leaders";
import HandleFastPackage from "@/features/home/HandleFastPackage";

const Home: React.FC = () => {
  return (
    <section>
      <div className="relative">
        <Hero />
        <div
          className={`
            w-full py-10 max-w-5xl mx-auto px-4 z-20
            lg:absolute lg:top-1/2 lg:left-1/2 
            lg:-translate-x-1/2 lg:-translate-y-1/2
          `}
        >
          <HandleFastPackage />
        </div>

        <PackageSelector />
      </div>

      <TouristRoute />
      <UniqueExperiences />
      <Leaders />
    </section>
  );
};

export default Home;
