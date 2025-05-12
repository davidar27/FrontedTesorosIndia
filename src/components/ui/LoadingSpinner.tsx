interface LoadingSpinnerProps {
  size?: number; 
  color?: string;
  className? : string;
}

const LoadingSpinner = ({ size = 40, color = "blue-500", className }: LoadingSpinnerProps) => {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <div
        className={`animate-spin rounded-full border-4 border-${color} border-t-transparent ${className}`}
        style={{ width: size, height: size }}
      ></div>
    </div>
  );
};

export default LoadingSpinner;
