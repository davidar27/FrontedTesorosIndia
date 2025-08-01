import React from "react";
import Button from "@/components/ui/buttons/Button";
import Picture from "../ui/display/Picture";

interface HeroSectionProps {
  sideImage?: string;
  sideImageAlt?: string;
  title: React.ReactNode;
  subtitle: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  containerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  sideImage,
  sideImageAlt,
  title,
  subtitle,
  buttonLabel,
  onButtonClick,
  containerClassName = "",
  subtitleClassName = "",
}) => {
  return (
    <section
      role="region"
      aria-label="Hero section"
      className={`relative w-full h-screen text-center  md:text-left text-white overflow-hidden group ${containerClassName}`}
    >
      {/* Imagen de fondo con efecto parallax y zoom sutil */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Picture
          className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
          alt=""
          src="/images/FondoDesktop.webp"
          srcSet="/images/FondoMobile.webp 480w ,/images/FondoDesktop.webp 1920w"
          sizes="(max-width: 600px) 480px, 1920px"
        />
      </div>

      {/* Capa degradada para mejor contraste */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />

      {/* Contenido con animaciones */}
      <div className="relative z-10 responsive-padding-x h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 lg:gap-12">
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-4 animate-fade-in-up">
            {title}
          </h1>

          <p className={`text-xl md:text-2xl mb-6 max-w-2xl mx-auto md:mx-0 ${subtitleClassName} animate-fade-in-up delay-100`}>
            {subtitle}
          </p>

          {buttonLabel && (
              <Button
                type="button"
                variant="primary"
                onClick={onButtonClick}
                className="w-fit mx-auto md:mx-0 animate-fade-in-up  px-8"
              >
                {buttonLabel}
              </Button>
          )}
        </div>

        {sideImage && (
          <div className="animate-fade-in-right">
            <img
              src={sideImage}
              alt={sideImageAlt || "Imagen decorativa"}
              className="max-w-xs lg:max-w-md rounded-xl shadow-2xl border-4 border-white/20 hover:border-primary transition-all duration-500 hover:shadow-glow transform hover:-translate-y-2"
              loading="lazy"
            />
          </div>
        )}
      </div>


    </section>
  );
};

export default React.memo(HeroSection);