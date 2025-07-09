import Avatar from "@/components/ui/display/Avatar";
import { Mail, Phone, Camera } from "lucide-react";
import { User } from "@/interfaces/user";
import { getImageUrl } from "@/utils/getImageUrl";

export const ProfileHeader: React.FC<{
    profile: User;
    isEditing: boolean;
    previewImage: string | null;
    onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ profile, isEditing, previewImage, onImageChange }) => {
    return (
        <div className="relative bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                    <Avatar
                        className="border-4 border-white shadow-xl"
                        src={previewImage || getImageUrl(profile?.image || '')}
                        name={profile?.name}
                        size={124}
                    />
                    {isEditing && (
                        <label
                            htmlFor="image-input"
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        >
                            <Camera className="w-8 h-8" />
                            <input
                                id="image-input"
                                type="file"
                                accept="image/*"
                                onChange={onImageChange}
                                className="hidden"
                            />
                        </label>
                    )}
                </div>
                <div className="text-center md:text-left text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-2">{profile.name}</h2>
                    <p className="text-emerald-100 text-lg mb-4">Explorador de Tesoros</p>
                    <div className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-x-6 gap-y-2 text-emerald-100">
                        <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span className="text-sm">{profile.email}</span>
                        </div>
                        {profile.phone && (
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                <span className="text-sm">{profile.phone}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
