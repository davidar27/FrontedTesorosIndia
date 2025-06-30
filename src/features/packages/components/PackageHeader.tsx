import { PackageData } from "../types/packagesTypes";
import ButtonIcon from "@/components/ui/buttons/ButtonIcon";
import { X } from "lucide-react";

interface PackageHeaderProps {
    packageData: PackageData;
    onClose?: () => void;
}

export const PackageHeader: React.FC<PackageHeaderProps> = ({
    packageData,
    onClose
    }) => {
        


    const handleClose = () => {
        onClose?.();
    }

    return (
        <header className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-primary ">
                    {packageData.name}
                </h1>
                {onClose && (
                    <ButtonIcon
                        onClick={handleClose}
                        className="!text-gray-500 !hover:text-gray-700"
                >
                        <X />
                    </ButtonIcon>
                )}
            </div>
        </header>
    );
};