import React from "react";

interface PictureProps {
    className?: string;
    alt?: string;
    // Imagen principal para <img src="">
    src: string;
    // Opcional: srcSet para distintos tamaños, ejemplo:
    // "/images/corredor-480.webp 480w, /images/corredor-768.webp 768w, /images/corredor-1920.webp 1920w"
    srcSet?: string;
    // Opcional: atributo sizes para indicar tamaños responsivos
    sizes?: string;
    icon?: React.ReactNode;
}

const Picture: React.FC<PictureProps> = ({
    className,
    src,
    alt,
    srcSet,
    sizes,
    icon,
}) => {
    if (icon) {
        return <span className={className}>{icon}</span>;
    }

    if (srcSet) {
        return (
            <picture>
                <source type="image/webp" srcSet={srcSet} sizes={sizes} />
                <img src={src} alt={alt} className={className} loading="lazy" decoding="async" />
            </picture>
        );
    }

    return <img src={src} alt={alt} className={className} loading="lazy" />;
};

export default Picture;
