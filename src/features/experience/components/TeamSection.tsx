import React from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { TeamMember } from '@/features/experience/types/experienceTypes';

interface TeamSectionProps {
    members: TeamMember[];
    editMembers: TeamMember[];
    isEditMode: boolean;
    permissions: {
        canManageMembers: boolean;
    };
    onAddMember?: (member: TeamMember) => void;
    onRemoveMember?: (memberId: number) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({
    members,
    editMembers,
    isEditMode,
    permissions
}) => {
    const displayMembers = isEditMode ? editMembers : members;

    return (
        <section className="mb-12">
            <div className="bg-white rounded-3xl shadow-xl p-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-800">Nuestro Equipo</h2>
                    </div>
                    {isEditMode && permissions.canManageMembers && (
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Agregar Integrante
                        </button>
                    )}
                </div>

                <div className="relative w-full max-w-6xl overflow-hidden">
                    {displayMembers.map((member) => (
                        <div key={member.id} className="group bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 mb-4">
                            <div className="flex gap-4">
                                <div className="relative">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md"
                                    />
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <span className="text-white text-xs">✓</span>
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-bold text-gray-800 text-lg mb-1">{member.name}</h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                                                <span className="bg-gray-100 px-2 py-1 rounded-lg">{member.age} años</span>
                                                <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg">
                                                    {member.occupation}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 text-sm leading-relaxed">
                                                {member.description}
                                            </p>
                                        </div>
                                        {isEditMode && permissions.canManageMembers && (
                                            <button className="text-red-500 hover:text-red-700 p-2">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {displayMembers.length === 0 && (
                        <div className="text-center text-gray-600 py-8">
                            No hay integrantes disponibles para esta experiencia
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;