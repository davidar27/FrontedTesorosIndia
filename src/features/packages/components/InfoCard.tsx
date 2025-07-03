interface InfoCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    bgColor: string;
    textColor: string;
    subtitle?: string;
}

export  const InfoCard: React.FC<InfoCardProps> = ({
    title,
    value,
    icon,
    bgColor,
    textColor,
    subtitle
}) => (
    <div className={`${bgColor} p-4 rounded-lg shadow-md`}>
        <h3 className={`font-semibold ${textColor} mb-2 flex items-center`}>
            {icon}
            {title}
        </h3>
        <p className={`text-2xl font-bold ${textColor.replace('text-', 'text-').replace('-700', '-800')}`}>
            {value}
        </p>
        {subtitle && (
            <p className="text-gray-600 text-sm mt-2">{subtitle}</p>
        )}
    </div>
);
