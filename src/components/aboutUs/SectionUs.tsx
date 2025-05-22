import AnimatedTitle from "../ui/AnimatedTitle";

interface SectionUsProps {
    title: string;
    text: string;
    imageSrc: string;
    imageAlt: string;
    styleImg?: string;
    order: 1 | 2;
}

const SectionUs: React.FC<SectionUsProps> = ({ title, text, imageSrc, imageAlt, order, styleImg }) => {
    return (

        <div className={`responsive-padding-x responsive-padding-y flex flex-col md:flex-row items-center gap-8 lg:gap-12 text-center lg:text-left  rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#00A650]/20 hover:border-solid hover:bg-white/20 group ${order === 2 ? 'md:flex-row-reverse' : ''}`}>
            {/* Imagen con efecto hover y brillo */}
            <div className="w-full md:w-1/2 flex justify-center transform transition-all duration-500 group-hover:scale-105">
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className={`${styleImg} rounded-lg shadow-xl object-cover border-2 border-white/30 group-hover:border-[#00A650] group-hover:shadow-[#00A650]/30 transition-all duration-300`}
                />
            </div>

            {/* Texto con animación sutil */}
            <div className="w-full md:w-1/2 space-y-6 ">
                <AnimatedTitle title={title}  className="md: "/>

                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                    {text}
                </p>


            </div>
        </div>
    );
}

export default SectionUs;
