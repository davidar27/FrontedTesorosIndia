import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Upload } from 'lucide-react';

interface TeamMember {
    id: number;
    name: string;
    age: number;
    occupation: string;
    description: string;
    image: string;
}

interface TeamMembersManagerProps {
    members: TeamMember[];
    onMembersChange: (members: TeamMember[]) => void;
    isEditMode: boolean;
}

const TeamMembersManager: React.FC<TeamMembersManagerProps> = ({
    members,
    onMembersChange,
    isEditMode
}) => {
    const [isAddingMember, setIsAddingMember] = useState(false);
    const [editingMemberId, setEditingMemberId] = useState<number | null>(null);
    const [newMember, setNewMember] = useState<Partial<TeamMember>>({
        name: '',
        age: 0,
        occupation: '',
        description: '',
        image: ''
    });

    const handleAddMember = () => {
        if (newMember.name && newMember.occupation) {
            const member: TeamMember = {
                id: Date.now(), // Temporal ID
                name: newMember.name,
                age: newMember.age || 0,
                occupation: newMember.occupation,
                description: newMember.description || '',
                image: newMember.image || ''
            };
            onMembersChange([...members, member]);
            setNewMember({
                name: '',
                age: 0,
                occupation: '',
                description: '',
                image: ''
            });
            setIsAddingMember(false);
        }
    };

    const handleEditMember = (memberId: number) => {
        const member = members.find(m => m.id === memberId);
        if (member) {
            setNewMember(member);
            setEditingMemberId(memberId);
        }
    };

    const handleSaveEdit = () => {
        if (editingMemberId && newMember.name && newMember.occupation) {
            const updatedMembers = members.map(member =>
                member.id === editingMemberId
                    ? { ...member, ...newMember }
                    : member
            );
            onMembersChange(updatedMembers);
            setEditingMemberId(null);
            setNewMember({
                name: '',
                age: 0,
                occupation: '',
                description: '',
                image: ''
            });
        }
    };

    const handleDeleteMember = (memberId: number) => {
        const updatedMembers = members.filter(member => member.id !== memberId);
        onMembersChange(updatedMembers);
    };

    const handleCancel = () => {
        setIsAddingMember(false);
        setEditingMemberId(null);
        setNewMember({
            name: '',
            age: 0,
            occupation: '',
            description: '',
            image: ''
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">Gestionar Integrantes</h3>
                {isEditMode && !isAddingMember && editingMemberId === null && (
                    <button
                        onClick={() => setIsAddingMember(true)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Agregar Integrante
                    </button>
                )}
            </div>

            {/* Formulario para agregar/editar */}
            {(isAddingMember || editingMemberId !== null) && (
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                        {editingMemberId ? 'Editar Integrante' : 'Agregar Nuevo Integrante'}
                    </h4>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nombre
                            </label>
                            <input
                                type="text"
                                value={newMember.name}
                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Nombre completo"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Edad
                            </label>
                            <input
                                type="number"
                                value={newMember.age || ''}
                                onChange={(e) => setNewMember({ ...newMember, age: parseInt(e.target.value) || 0 })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Edad"
                                min="1"
                                max="120"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ocupación
                            </label>
                            <input
                                type="text"
                                value={newMember.occupation}
                                onChange={(e) => setNewMember({ ...newMember, occupation: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Ocupación o rol"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Foto
                            </label>
                            <button
                                type="button"
                                className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 transition-colors flex items-center gap-2"
                            >
                                <Upload className="w-4 h-4 text-gray-500" />
                                <span className="text-gray-600">Subir foto</span>
                            </button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <textarea
                            value={newMember.description}
                            onChange={(e) => setNewMember({ ...newMember, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            rows={3}
                            placeholder="Breve descripción del integrante..."
                        />
                    </div>

                    <div className="flex items-center gap-3 mt-6">
                        <button
                            onClick={editingMemberId ? handleSaveEdit : handleAddMember}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {editingMemberId ? 'Guardar Cambios' : 'Agregar Integrante'}
                        </button>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Cancelar
                        </button>
                    </div>
                </div>
            )}

            {/* Lista de integrantes */}
            <div className="space-y-4">
                {members.map((member) => (
                    <div key={member.id} className="bg-white border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                            <img
                                src={member.image || '/placeholder-avatar.png'}
                                alt={member.name}
                                className="w-16 h-16 rounded-xl object-cover ring-2 ring-white shadow-md"
                            />
                            <div className="flex-1">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 text-lg">{member.name}</h4>
                                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                                            <span className="bg-gray-100 px-2 py-1 rounded-lg">{member.age} años</span>
                                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg">
                                                {member.occupation}
                                            </span>
                                        </div>
                                        {member.description && (
                                            <p className="text-gray-700 text-sm mt-2">{member.description}</p>
                                        )}
                                    </div>
                                    {isEditMode && (
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEditMember(member.id)}
                                                className="text-blue-500 hover:text-blue-700 p-2"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMember(member.id)}
                                                className="text-red-500 hover:text-red-700 p-2"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {members.length === 0 && (
                    <div className="text-center text-gray-600 py-8">
                        No hay integrantes registrados
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamMembersManager; 