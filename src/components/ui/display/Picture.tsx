import React from "react";

interface PictureProps {
    className?: string;
    alt?: string;
    src?: string | null;
    srcSet?: string;
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
                <img src={src || ''} alt={alt} className={className} loading="lazy" decoding="async" />
            </picture>
        );
    }

    return <img src={src || ''} alt={alt} className={className} loading="lazy" />;
};

export default Picture;
