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
        <PackageSelector />
        <div className={`
        w-full max-w-5xl px-4 z-20
        ${window.innerWidth < 768 ? '' : 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}
        `}>
          <HandleFastPackage />
        </div>
      </div>
      <TouristRoute />
      <UniqueExperiences />
      <Leaders />
    </section>
  );
};

export default Home;
