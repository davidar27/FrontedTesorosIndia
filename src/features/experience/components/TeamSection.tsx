import React from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import { TeamMember } from '@/features/experience/types/experienceTypes';
import Picture from '@/components/ui/display/Picture';
import { getImageUrl } from '@/utils/getImageUrl';

interface TeamSectionProps {
    members: TeamMember[];
    editMembers: TeamMember[];
    isEditMode: boolean;
    permissions: {
        canManageMembers: boolean;
    };
    onAddMember?: (member: TeamMember) => void;
    onRemoveMember?: (memberId: number) => void;
    onEditDataChange: (data: Partial<TeamMember>) => void;
}

const TeamSection: React.FC<TeamSectionProps> = ({
    members,
    editMembers,
    isEditMode,
    permissions,
    onEditDataChange
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
                        <div
                            key={member.id}
                            className="group relative bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-500 mb-6 overflow-hidden"
                        >
                            {/* Background pattern */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Subtle glow effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl" />

                            <div className="relative z-10 flex gap-5">
                                {/* Avatar section with enhanced design */}
                                <div className="relative flex-shrink-0">
                                    <div className="relative">
                                        <Picture
                                            src={getImageUrl(member.image)}
                                            alt={member.name}
                                            className="w-20 h-20 rounded-2xl object-cover ring-3 ring-white shadow-lg group-hover:ring-emerald-100 transition-all duration-300"
                                        />
                                        {/* Status indicator with glow */}
                                        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-emerald-200">
                                            <span className="text-white text-xs font-bold">✓</span>
                                        </div>
                                        {/* Pulse animation for status */}
                                        <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-emerald-500 rounded-full animate-ping opacity-20" />
                                    </div>
                                </div>

                                {/* Content section */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 min-w-0">
                                            {/* Name with gradient text */}
                                            <h3 className="font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent text-xl mb-2 group-hover:from-emerald-700 group-hover:to-emerald-500 transition-all duration-300">
                                                {member.name}
                                            </h3>

                                            {/* Tags with improved styling */}
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200 group-hover:from-gray-100 group-hover:to-gray-150 transition-all duration-300">
                                                    <svg className="w-3 h-3 mr-1.5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                    </svg>
                                                    {member.age} años
                                                </span>
                                                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-medium bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border border-emerald-200 group-hover:from-emerald-100 group-hover:to-emerald-150 transition-all duration-300">
                                                    <svg className="w-3 h-3 mr-1.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    {member.profession}
                                                </span>
                                            </div>

                                            {/* Description with better typography */}
                                            <div className="flex-grow">
                                                {isEditMode ? (
                                                    <div className="relative h-full">
                                                        <textarea
                                                            value={member.description || ''}
                                                            onChange={(e) => onEditDataChange({ ...member, description: e.target.value })}
                                                            className="w-full h-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400 resize-none transition-all duration-200 bg-white text-gray-700 placeholder-gray-400"
                                                            placeholder="Cuenta la historia fascinante de este integrante..."
                                                            maxLength={300}
                                                            rows={3}
                                                        />
                                                        <div className="absolute bottom-3 right-3 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                                                            {member.description?.length || 0}/300
                                                        </div>
                                                    </div>
                                                ):(
                                                    <textarea
                                                        value={member.description || ''}
                                                        readOnly
                                                        className="w-full bg-transparent border-none outline-none resize-none text-gray-500 italic text-ellipsis"
                                                        rows={3}
                                                    />
                                                )}
                                            </div>
                                        </div>

                                        {/* Action button with enhanced styling */}
                                        {isEditMode && permissions.canManageMembers && (
                                            <div className="flex-shrink-0 ml-4">
                                                <button className="relative p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300 group/btn">
                                                    <Trash2 className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
                                                    {/* Tooltip */}
                                                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                                                        Eliminar miembro
                                                    </div>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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