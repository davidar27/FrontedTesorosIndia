import React, {  useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';
import Picture from '@/components/ui/display/Picture';
import { getImageUrl } from '@/utils/getImageUrl';
import { fileToWebp } from '@/utils/fileToWebp';

interface ImageUploadProps {
    onFileSelect: (file: File | null) => void;
    currentFile?: File | null | string;
    entity?: 'package' | 'product';
    className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect, currentFile, entity = 'package', className }) => {
    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>): Promise<void> => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
                try {
                    const webpFile = await fileToWebp(file);
                    onFileSelect(webpFile);
                } catch (error) {
                    console.error('Error converting to WebP:', error);
                    alert('Error al convertir la imagen a WebP. Intenta con otra imagen.');
                }
            } else {
                alert('Por favor selecciona una imagen menor a 5MB');
            }
        }
    }, [onFileSelect]);

    const handleFileSelect = useCallback(async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
                try {
                    const webpFile = await fileToWebp(file);
                    onFileSelect(webpFile);
                } catch (error) {
                    console.error('Error converting to WebP:', error);
                    alert('Error al convertir la imagen a WebP. Intenta con otra imagen.');
                }
            } else {
                alert('Por favor selecciona una imagen menor a 5MB');
            }
        }
    }, [onFileSelect]);

    const handleRemoveFile = useCallback(() => {
        onFileSelect(null);
    }, [onFileSelect]);

    const getImageSrc = () => {
        if (currentFile instanceof File) {
            return URL.createObjectURL(currentFile);
        }
        if (typeof currentFile === 'string') {
            return getImageUrl(currentFile);
        }
        return null;
    };

    return (
        <section className={`mb-8 flex flex-col items-center `}>
            <label className="block text-lg font-semibold text-green-700 mb-2">{entity === 'package' ? 'Imagen del paquete' : 'Imagen del producto'}</label>
            <div
                className={`relative border-2 border-dashed rounded-xl p-6 w-full max-w-md bg-gray-50 flex flex-col items-center justify-center ${className} ${currentFile ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {getImageSrc() ? (
                    <Picture src={getImageSrc()} alt="Preview" className="w-40 h-40 max-w-70 max-h-70 object-cover rounded-lg mb-2" />
                ) : (
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                    aria-label={entity === 'package' ? 'Cargar imagen del paquete' : 'Cargar imagen del producto'}
                />
                <span className="text-gray-500 text-sm">{entity === 'package' ? 'Arrastra o haz clic para subir una imagen (máx 5MB)' : 'Arrastra o haz clic para subir una imagen (máx 5MB)'}</span>
                {currentFile && (
                    <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="mt-2 text-blue-500 underline text-xs"
                    >
                        Cambiar imagen
                    </button>
                )}
            </div>
        </section>
    );
};
