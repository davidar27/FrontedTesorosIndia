import Hero from '@/components/home/Hero';
import Header from '@/components/layouts/Header';
import SectionUs from '@/components/layouts/SectionUs';
import Us from '@/components/layouts/Us';
import History from '@/assets/images/HistoryUs.png';
import Paisaje from '@/assets/images/Paisaje.webp';
import CuyUs from '@/assets/images/CuyUs.png';
import Footer from '@/components/layouts/Footer';

const AboutUs = () => {
    return (
        <main>
            <Hero />
            <Us />
            <Header />
            <SectionUs
                title="Nuestra Historia"
                text="La historia de 'Tesoros de la India' comenzó con un pequeño grupo de apasionados
                artesanos, maestros y guías culturales que compartían un profundo amor por su tierra
            y sus tradiciones. Cada uno tenía un talento único: desde la creación de exquisitos
            bordados hechos a mano hasta la preparación de especias ancestrales que dan vida
            a los platos típicos de la India. Con el paso del tiempo, más y más personas se unieron
            a esta comunidad, incluyendo jóvenes emprendedores y viajeros curiosos."
                imageSrc={History} styleImg='w-[400px] h-[300px] object-cover rounded-lg shadow-lg'
                imageAlt="Recolectando frutos"
                order={1}
            />

            <SectionUs
                title="Nuestra Misión"
                text="La historia de 'Tesoros de la India' comenzó con un pequeño grupo de apasionados
                artesanos, maestros y guías culturales que compartían un profundo amor por su tierra
            y sus tradiciones. Cada uno tenía un talento único: desde la creación de exquisitos
            bordados hechos a mano hasta la preparación de especias ancestrales que dan vida
            a los platos típicos de la India. Con el paso del tiempo, más y más personas se unieron
            a esta comunidad, incluyendo jóvenes emprendedores y viajeros curiosos."
                imageSrc={Paisaje} styleImg='w-[533px] h-[363px] object-cover rounded-lg shadow-lg'
                imageAlt="Recolectando frutos"
                order={2}
            />

            <SectionUs
                title="Nuestra Visión"
                text="La historia de 'Tesoros de la India' comenzó con un pequeño grupo de apasionados
                artesanos, maestros y guías culturales que compartían un profundo amor por su tierra
            y sus tradiciones. Cada uno tenía un talento único: desde la creación de exquisitos
            bordados hechos a mano hasta la preparación de especias ancestrales que dan vida
            a los platos típicos de la India. Con el paso del tiempo, más y más personas se unieron
            a esta comunidad, incluyendo jóvenes emprendedores y viajeros curiosos."
                imageSrc={CuyUs} styleImg='w-[533px] h-[363px] object-cover rounded-lg shadow-lg'
                imageAlt="Cuy"
                order={1}
            />
            <Footer />
        </main>
    )
}

export default AboutUs
