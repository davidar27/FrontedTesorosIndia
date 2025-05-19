import React from "react";
import Button from "@/components/ui/Button";
import backgroundImage from "@/assets/images/corredor.jpeg"

interface HeroSectionProps {
  sideImage?: string;
  title: React.ReactNode;
  sideImageAlt : string;
  subtitle: string;
  buttonLabel?: string;
  className: string;
  onButtonClick?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  sideImage,
  title,
  subtitle,
  sideImageAlt,
  buttonLabel,
  className,
  onButtonClick,
}) => {
  return (
    <section className="relative w-full min-h-[70vh] py-40 text-center md:text-left text-white overflow-hidden">
      <img
        src={backgroundImage}
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover object-center brightness-60"
      />

      <div className="relative z-10 responsive-padding-x h-full flex flex-col md:flex-row items-center justify-center md:justify-between">
        <div className="flex-1 flex flex-col justify-center ">
          <h1 className={`text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-4 whitespace-pre-line ${className}`}>
            {title}
          </h1>
          <p className={`text-lg md:text-xl mb-6 ${className}`}>{subtitle}</p>
          {buttonLabel && (
            <Button className="w-fit mx-auto md:mx-0" onClick={onButtonClick}>
              {buttonLabel}
            </Button>
          )}
        </div>

        {sideImage && (
          <div className="flex-1 hidden md:flex justify-end">
            <img
              src={sideImage}
              alt={sideImageAlt}
              className="max-w-sm lg:max-w-md rounded-xl shadow-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default HeroSection;
