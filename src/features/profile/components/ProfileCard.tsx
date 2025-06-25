import { ProfileCardProps } from "@/features/profile/types";

export const ProfileCard: React.FC<ProfileCardProps> = ({
    icon: Icon,
    title,
    value,
    placeholder,
    type = "text",
    isEditing,
    gradientFrom,
    gradientTo,
    borderColor,
    iconBgColor,
    focusRingColor,
    onChange
}) => (
    <div className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-6 border ${borderColor}`}>
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
        {isEditing ? (
            <input
                type={type}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                className={`w-full bg-white border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 ${focusRingColor} focus:border-transparent transition-all`}
                placeholder={placeholder}
            />
        ) : (
            <p className="text-gray-700 text-lg">{value || 'No especificado'}</p>
        )}
    </div>
);