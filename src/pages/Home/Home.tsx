import Hero from "@/features/home/Hero";
import PackageSelector from "@/features/home/PackageSelector";
import TouristRoute from "@/features/home/TouristRoute";
import UniqueExperiences from "@/features/home/UniqueExperiences";
import Leaders from "@/features/home/Leaders";
import HandleReservation from "@/features/home/HandleReservation";


const Home: React.FC = () => {



  return (
    <div className=" relative">
      <Hero />

      <div className="absolute -translate-y-1/2 z-10 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] max-w-5xl">
        <HandleReservation />
      </div>

      <PackageSelector />

      {/* <TouristRoute /> */}

      <UniqueExperiences />

      <Leaders />

    </div>
  );
};

export default Home;
