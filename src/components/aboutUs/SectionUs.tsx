

interface SectionUsProps {
    title: string;
    text: string;
    imageSrc: string;
    imageAlt: string;
    styleImg: string;
    order: 1 | 2;
}

const SectionUs: React.FC<SectionUsProps> = ({ title, text, imageSrc, imageAlt, order, styleImg }) => {
    return (
        <div className={`bg-white py-16 responsive-padding-x flex flex-col md:flex-row items-center gap-8 ${order === 2 ? 'md:flex-row-reverse' : ''}`}>
            {/* Imagen */}
            <div className="w-full md:w-1/2 flex justify-center">
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className= {styleImg}
                />
            </div>

            {/* Texto */}
            <div className="w-full md:w-1/2">
                <h2 className="text-[48px] font-bold text-[#00A650] mb-4">{title}</h2>
                <p className="text-[22px] text-black leading-relaxed">{text}</p>
            </div>
        </div>
    );
}

export default SectionUs;
