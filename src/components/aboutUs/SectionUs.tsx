

import AnimatedTitle from "../ui/AnimatedTitle";

interface SectionUsProps {
    title: string;
    text: string;
    imageSrc: string;
    imageAlt: string;
    styleImg?: string;
    order: 1 | 2;
}

const SectionUs: React.FC<SectionUsProps> = ({
    title,
    text,
    imageSrc,
    imageAlt,
    order,
    styleImg
}) => {
    return (

        <div className={`
      responsive-padding-x 
      py-6 md:py-8 
      gap-4 md:gap-6 
      flex flex-col md:flex-row 
      items-center 
      text-center md:text-left
      bg-white/10 backdrop-blur-sm 
      transition-all duration-300 
      hover:shadow-lg hover:shadow-[#00A650]/20 
      hover:bg-white/20 
      group 
      ${order === 2 ? 'md:flex-row-reverse' : ''}
    `}>
           
            {/* Image container */}
            <div className={`
        ${styleImg}  
        flex justify-center 
        w-full md:w-1/2
        transform transition-all duration-500 
        group-hover:scale-[1.02]
      `}>
                <img
                    src={imageSrc}
                    alt={imageAlt}
                    className="
            w-full max-w-md 
            h-auto 
            rounded-lg 
            shadow-md 
            object-cover 
            border-2 border-white/30 
            group-hover:border-[#00A650]/50 
            group-hover:shadow-[#00A650]/20 
            transition-all duration-300
          "
                />
            </div>

            {/* Text content */}
            <div className="w-full md:w-1/2 space-y-4 px-2 md:px-0">
                <AnimatedTitle
                    title={title}
                    className="mb-2"
                    align="left"
                />

                <p className="
          text-base md:text-lg 
          text-gray-800 
          leading-snug md:leading-relaxed 
          opacity-90 
          group-hover:opacity-100 
          transition-opacity duration-300
        ">
                    {text}
                </p>
            </div>
        </div>
    );
}

export default SectionUs;