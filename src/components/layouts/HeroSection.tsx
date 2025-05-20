import React from "react";
import Button from "@/components/ui/Button";
import Picture from "../ui/Picture";

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
      className={`relative w-full min-h-[60vh] sm:min-h-[70vh] max-h-[60vh] md:max-h-screen py-20 sm:py-32 md:py-40 text-center md:text-left text-white overflow-hidden group ${containerClassName}`}
    >
      {/* Imagen de fondo con efecto parallax y zoom sutil */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Picture
          className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
          alt=""
          src="/images/FondoDesktop.webp"
          srcSet="/images/FondoMobile.webp 480w, /images/FondoDesktop.webp 1920w"
          sizes="(max-width: 600px) 480px, 1920px"
        />
      </div>

      {/* Capa degradada para mejor contraste */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/50 to-black/30" />

      {/* Contenido con animaciones */}
      <div className="relative z-20 responsive-padding-x h-full flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 lg:gap-12">
        <div className="flex-1 flex flex-col justify-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4 animate-fade-in-up">
            {title}
          </h1>

          <p className={`text-lg md:text-xl mb-6 max-w-2xl mx-auto md:mx-0 ${subtitleClassName} animate-fade-in-up delay-100`}>
            {subtitle}
          </p>

          {buttonLabel && (
            <div className="animate-fade-in-up delay-200">
              <Button
                type="button"
                className="w-fit mx-auto md:mx-0 transform transition-all duration-300 hover:scale-105 hover:shadow-glow"
                onClick={onButtonClick}
              >
                {buttonLabel}
              </Button>
            </div>
          )}
        </div>

        {sideImage && (
          <div className="flex-1 hidden md:flex justify-end animate-fade-in-right">
            <img
              src={sideImage}
              alt={sideImageAlt || "Imagen decorativa"}
              className="max-w-sm lg:max-w-md rounded-xl shadow-2xl border-4 border-white/20 hover:border-primary transition-all duration-500 hover:shadow-glow transform hover:-translate-y-2"
              loading="lazy"
            />
          </div>
        )}
      </div>

      {/* Efecto de partículas opcional (puedes implementarlo con una librería como tsParticles) */}
      <div className="absolute inset-0 z-10 pointer-events-none" aria-hidden="true">
        {/* Aquí iría el componente de partículas */}
      </div>
    </section>
  );
};

export default React.memo(HeroSection);