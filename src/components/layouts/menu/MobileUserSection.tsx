import { CircleUserRound, CircleEllipsis } from "lucide-react";


const MobileUserSection = ({
    user,
    textColor,
    onProfile,
    onMenuToggle
}: {
    user: { name?: string } | null;
    textColor?: string;
    onProfile: () => void;
    onMenuToggle: () => void;
}) => (
    <div className={`w-full flex md:hidden items-center gap-2 justify-between text-${textColor}`}>
        <button onClick={onProfile} className={`capitalize text-sm flex gap-2 items-center`}>
            <CircleUserRound size={20} />
            {user?.name?.split(" ").slice(0, 2).join(" ")}
        </button>
        <button onClick={onMenuToggle} className="text-gray-800 font-bold hover:underline flex gap-0.5 items-center">
            <CircleEllipsis size={20} />
        </button>
    </div>
);

export default MobileUserSection;