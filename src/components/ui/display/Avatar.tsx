import Picture from './Picture';
import { getImageUrl } from '@/utils/getImageUrl';

type AvatarProps = {
    name?: string | null;
    size?: number;
    className?: string;
    src?: string | null;
};

const getColorFromName = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 75%)`;
};

const Avatar = ({ name = '', size = 40, className = '', src = null }: AvatarProps) => {
    const initial = name?.trim().charAt(0).toUpperCase() || '';
    const backgroundColor = getColorFromName(name || '');
    const hasImage = src && src.trim() !== '';

    return (
        <div
            className={`flex items-center justify-center rounded-full text-white font-bold overflow-hidden ${className}`}
            style={{
                width: size,
                height: size,
                fontSize: size / 2,
                backgroundColor: hasImage ? 'transparent' : backgroundColor,
                color: hasImage ? 'transparent' : 'hsl(0, 0%, 20%)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
        >   
            {hasImage ? (
                <Picture src={src || '' || getImageUrl(src || '')} alt={name || ''} />
            ) : (
                <span className="text-2xl">{initial}</span>
            )}
            <span 
                className="absolute opacity-0 pointer-events-none"
                aria-label={`Avatar de ${name}`}
                title={name || ''}
            >
                {initial}
            </span>
        </div>
    );
};

export default Avatar;