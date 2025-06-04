import { Toaster } from 'sonner';

const ToastProvider = () => {
    return (
        <Toaster
            position="top-right"
            richColors
            duration={3000}
            style={{
                background: '#fff',
                color: '#363636',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                borderRadius: '0.5rem',
                padding: '1rem',
            }}
        />
    );
};

export default ToastProvider; 