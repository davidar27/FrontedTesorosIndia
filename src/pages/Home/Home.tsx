import Hero from "@/components/home/Hero";
import PackageSelector from "@/components/home/PackageSelector";
import TouristRoute from "@/components/home/TouristRoute";
import UniqueExperiences from "@/components/home/UniqueExperiences";
import Leaders from "@/components/home/Leaders";
import HandleReservation from "@/components/home/HandleReservation";

const Home: React.FC = () => {

  return (
    <div className=" relative">
      <Hero />

      <div className="absolute -translate-y-1/2 z-10 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] max-w-5xl">
        <HandleReservation />
      </div>

      <PackageSelector />

      <TouristRoute />

      <UniqueExperiences />

      <Leaders />

    </div>
  );
};

export default Home;
