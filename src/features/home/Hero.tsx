import HeroSection from "@/components/layouts/HeroSection";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section className="mb-4 md:mb-8 2xl:mb-0">
            <HeroSection
                title={
                    <>
                        TESOROS <br /> DE LA INDIA
                    </>
                }
                subtitle="En nuestro territorio podrás vivir experiencias inigualables"
                buttonLabel="¿Quiénes somos?"
                onButtonClick={() => navigate("/nosotros")}
            />
        </section>
    );
};

export default Hero;
