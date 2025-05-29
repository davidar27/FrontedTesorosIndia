type AvatarProps = {
    name: string;
    size?: number;
    className?: string;
};

const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 75%)`;
};

const Avatar = ({ name, size = 40, className = '' }: AvatarProps) => {
    const initial = name.trim().charAt(0).toUpperCase();
    const backgroundColor = getColorFromName(name);

    return (
        <div
            className={`flex items-center justify-center rounded-full text-white font-bold ${className}`}
            style={{
                width: size,
                height: size,
                fontSize: size / 2,
                backgroundColor,
                color: 'hsl(0, 0%, 20%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            aria-label={`Avatar de ${name}`}
            title={name}
        >
            {initial}
        </div>
    );
};

export default Avatar;