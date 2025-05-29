interface ProgressBarProps {
    progress: number;
    className?: string;
    barClassName?: string;
}

export const ProgressBar = ({ progress, className = '', barClassName = '' }: ProgressBarProps) => {
    return (
        <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
            <div
                className={`bg-secondary h-2 rounded-full transition-all duration-1000 ease-linear ${barClassName}`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
        </div>
    );
}; 