import bannerImg from "@/assets/images/Paisaje1.webp";
import Button from "@/components/ui/Button";


const Hero = () => {
  return (
    <section className="relative w-full h-screen text-white overflow-hidden">
      <img
        src={bannerImg}
        alt="Banner"
        className="absolute inset-0 w-full h-full object-cover object-center brightness-60"
      />

      <div className="relative z-10 flex flex-col justify-center h-full px-6 lg:px-30 max-w-7xl">
        <h1 className="text-4xl lg:text-8xl  md:text-6xl font-bold leading-tight mb-4">
          TESOROS <br /> DE LA INDIA
        </h1>
        <p className="text-lg md:text-xl mb-6">
          “En nuestro territorio podrás vivir experiencias inigualables”
        </p>
        <Button className="w-fit ">¿Quiénes somos?</Button>
      </div>
    </section>
  );
};

export default Hero;
