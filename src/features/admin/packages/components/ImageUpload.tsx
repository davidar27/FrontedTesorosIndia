
import React, { useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { Upload } from 'lucide-react';

interface ImageUploadProps {
    onFileSelect: (file: File | null) => void;
    currentFile?: File | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onFileSelect, currentFile }) => {
    const [draggedFile, setDraggedFile] = useState<File | null>(currentFile || null);

    const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: DragEvent<HTMLDivElement>): void => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
                setDraggedFile(file);
                onFileSelect(file);
            } else {
                alert('Por favor selecciona una imagen menor a 5MB');
            }
        }
    }, [onFileSelect]);

    const handleFileSelect = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        console.log(file);
        if (file) {
            if (file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
                setDraggedFile(file);
                onFileSelect(file);
            } else {
                alert('Por favor selecciona una imagen menor a 5MB');
            }
        }
    }, [onFileSelect]);

    const handleRemoveFile = useCallback(() => {
        setDraggedFile(null);
        onFileSelect(null);
    }, [onFileSelect]);

    return (
        <section className="mb-8 flex flex-col items-center">
            <label className="block text-lg font-semibold text-green-700 mb-2">Imagen del paquete</label>
            <div
                className={`relative border-2 border-dashed rounded-xl p-6 w-full max-w-md bg-gray-50 flex flex-col items-center justify-center ${draggedFile ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                {draggedFile ? (
                    <img src={URL.createObjectURL(draggedFile)} alt="Preview" className="w-40 h-40 object-cover rounded-lg mb-2" />
                ) : (
                    <Upload className="h-12 w-12 text-gray-400 mb-2" />
                )}
                <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileSelect}
                    aria-label="Cargar imagen del paquete"
                />
                <span className="text-gray-500 text-sm">Arrastra o haz clic para subir una imagen (máx 5MB)</span>
                {draggedFile && (
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
