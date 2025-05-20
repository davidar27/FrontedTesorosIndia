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
      className={`relative w-full min-h-[60vh] sm:min-h-[70vh] py-24 sm:py-32 md:py-40 text-center md:text-left text-white overflow-hidden ${containerClassName}`}
    >
      {/* Imagen de fondo posicionada correctamente */}
      <div className="absolute inset-0 z-0">
        <Picture
          className="w-full h-full object-cover"
          alt=""
          src="/images/FondoDesktop.webp"
          srcSet="/images/FondoMobile.webp 480w, /images/FondoDesktop.webp 1920w"
          sizes="(max-width: 600px) 480px, 1920px"
        />
      </div>

      {/* Capa oscura */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Contenido */}
      <div className="relative z-10 responsive-padding-x h-full flex flex-col md:flex-row items-center justify-center md:justify-between">
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight mb-4">
            {title}
          </h1>
          <p className={`text-lg md:text-xl mb-6 ${subtitleClassName}`}>
            {subtitle}
          </p>
          {buttonLabel && (
            <Button type="button" className="w-fit mx-auto md:mx-0" onClick={onButtonClick}>
              {buttonLabel}
            </Button>
          )}
        </div>

        {sideImage && (
          <div className="flex-1 hidden md:flex justify-end">
            <img
              src={sideImage}
              alt={sideImageAlt || "Imagen decorativa"}
              className="max-w-sm lg:max-w-md rounded-xl shadow-lg"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </section>

  );
};

export default React.memo(HeroSection);
