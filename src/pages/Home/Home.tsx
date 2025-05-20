import Hero from "@/components/home/Hero";
import PackageSelector from "@/components/home/PackageSelector";
import TouristRoute from "@/components/home/TouristRoute";
import UniqueExperiences from "@/components/home/UniqueExperiences";
import Leaders from "@/components/home/Leaders";
import History from "@/components/home/History";
import HandleReservation from "@/components/home/HandleReservation";

const Home: React.FC = () => {

  return (
    <div className=" relative">
      <main>

        <Hero />
        
        <div className="absolute -translate-y-1/2 z-10 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[90%] max-w-5xl">
          <HandleReservation />
        </div>
        
          <PackageSelector />

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
