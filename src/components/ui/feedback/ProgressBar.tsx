interface ProgressBarProps {
    progress: number;
    className?: string;
}

const ProgressBar = ({ progress, className = '' }: ProgressBarProps) => {
    return (
        <div className={`w-full h-2 bg-gray-200 rounded-full ${className}`}>
            <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

export default ProgressBar; 