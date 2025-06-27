import Picture from "@/components/ui/display/Picture";
import { getImageUrl } from "@/utils/getImageUrl";
import { Eye } from "lucide-react";

interface PackageImageProps {
    image?: string;
    name: string;
}

export const PackageImage: React.FC<PackageImageProps> = ({ image, name }) => {
    if (!image) return null;

    return (
        <section className="mb-8 flex justify-center">
            <div className="relative max-w-md w-full">
                <Picture
                    src={getImageUrl(image)}
                    alt={name}
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                />
                <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-lg text-xs">
                    <Eye className="inline h-3 w-3 mr-1" />
                    Vista previa
                </div>
            </div>
        </section>
    );
};