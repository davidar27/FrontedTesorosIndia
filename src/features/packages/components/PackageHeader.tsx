import { PackageData } from "../types/packagesTypes";

interface PackageHeaderProps {
    packageData: PackageData;
}

export const PackageHeader: React.FC<PackageHeaderProps> = ({
    packageData
}) => {

    return (
        <header className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-extrabold text-primary ">
                    {packageData.name}
                </h1>
            </div>
        </header>
    );
};