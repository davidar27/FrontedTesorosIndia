import HeroSection from '@/components/layouts/HeroSection';
import SectionUs from '@/components/aboutUs/SectionUs';
import History from '@/assets/images/HistoryUs.webp';
import Paisaje from '@/assets/images/Paisaje.webp';
import CuyUs from '@/assets/images/CuyUs.webp';
import Grupo from '@/assets/images/Grupo.webp';

const AboutUs = () => {
    return (
        <>
            <HeroSection
                title={
                    <>
                        Sobre<br />Nosotros
                    </>
                }
                subtitle="Somos un grupo dedicado a conservar el territorio, promover el turismo rural y mejorar los ingresos de las familias campesinas de manera sostenible."
                sideImage={Grupo}
                sideImageAlt="Grupo"                
            />

            <SectionUs
                title="Nuestra Historia"
                text="La historia de 'Tesoros de la India' comenzó con un pequeño grupo de apasionados
                    artesanos, maestros y guías culturales que compartían un profundo amor por su tierra
                    y sus tradiciones. Cada uno tenía un talento único: desde la creación de exquisitos
                    bordados hechos a mano hasta la preparación de especias ancestrales que dan vida
                    a los platos típicos de la India. Con el paso del tiempo, más y más personas se unieron
                    a esta comunidad, incluyendo jóvenes emprendedores y viajeros curiosos."
                imageSrc={History}
                imageAlt="Recolectando frutos"
                order={1}
                styleImg="w-1/2"
                
                
            />

            <SectionUs
                title="Nuestra Misión"
                text="Nuestra misión es empoderar a las comunidades rurales a través del turismo sostenible y responsable. Buscamos crear experiencias auténticas que conecten a los visitantes con la esencia cultural, natural y humana del territorio."
                imageSrc={Paisaje}
                imageAlt="Paisaje natural"
                order={2}
            />

            <SectionUs
                title="Nuestra Visión"
                text="Aspiramos a ser un referente en turismo rural sostenible, fomentando el respeto por el medio ambiente, la cultura y las personas. Imaginamos un futuro donde las tradiciones locales florezcan y sean valoradas en todo el mundo."
                imageSrc={CuyUs}
                imageAlt="Cuy"
                order={1}
            />
        </>
    );
};

export default AboutUs;
