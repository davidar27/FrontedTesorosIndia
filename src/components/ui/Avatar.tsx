type AvatarProps = {
    name: string;
    size?: number; 
};

const Avatar = ({ name, size = 40 }: AvatarProps) => {
    const initial = name.trim().charAt(0).toUpperCase();

    return (
        <div
            className="flex items-center justify-center rounded-full bg-blue-600 text-white font-bold"
            style={{
                width: size,
                height: size,
                fontSize: size / 2,
            }}
        >
            {initial}
        </div>
    );
};

export default Avatar;
