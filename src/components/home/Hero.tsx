import HeroSection from "../layouts/HeroSection";
import { useNavigate } from "react-router-dom";

const Hero = () => {
    const navigate = useNavigate();

    return (
        <section>
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
