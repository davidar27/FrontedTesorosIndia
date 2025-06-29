import Picture from "@/components/ui/display/Picture";
import { getImageUrl } from "@/utils/getImageUrl";

interface PackageImageProps {
    image?: string;
    name: string;
}

export const PackageImage: React.FC<PackageImageProps> = ({ image, name }) => {
    if (!image) return null;

    return (
        <section className="mb-8 flex justify-center">
            <div className=" max-w-md w-full">
                <Picture
                    src={getImageUrl(image)}
                    alt={name}
                    className="w-full h-64 object-contain rounded-xl shadow-lg"
                />
            </div>
        </section>
    );
};