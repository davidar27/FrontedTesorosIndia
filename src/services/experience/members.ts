import { axiosInstance } from '@/api/axiosInstance';
import { CreateMemberData } from '@/features/experience/components/CreateMemberForm';
import { EditMemberData } from '@/features/experience/components/EditMemberForm';

export const createMember = async (member: CreateMemberData & { experience_id: number }) => {
    const { experience_id, image, ...rest } = member;
    const formData = new FormData();

    console.log('Datos del miembro a enviar:', { experience_id, ...rest, hasImage: !!image }); // Debug log

    // Agrega los campos de texto
    Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    // Agrega la imagen si existe
    if (image) {
        formData.append('file', image); 
    }

    const { data } = await axiosInstance.post(`/experiencias/miembros/${experience_id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    console.log('Respuesta del backend:', data); // Debug log
    
    // Transformar la respuesta para que coincida con la estructura esperada
    if (data.member) {
        const transformedMember = {
            id: data.member.memberId,
            name: data.member.name,
            age: data.member.age,
            profession: data.member.profession,
            description: data.member.description,
            image: data.member.image
        };
        console.log('Miembro transformado:', transformedMember); // Debug log
        return transformedMember;
    }
    
    return data;
};

export const deleteMember = async (memberId: number) => {
    console.log('Eliminando miembro del backend con ID:', memberId); // Debug log
    const { data } = await axiosInstance.delete(`/experiencias/miembros/${memberId}`);
    console.log('Respuesta del backend al eliminar:', data); // Debug log
    return data;
};

export const updateMember = async (memberId: number, member: EditMemberData) => {
    console.log('Actualizando miembro del backend con ID:', memberId, 'datos:', member); // Debug log
    const { image, ...rest } = member;
    const formData = new FormData();

    // Agrega los campos de texto
    Object.entries(rest).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            formData.append(key, String(value));
        }
    });

    // Agrega la imagen si existe
    if (image) {
        formData.append('file', image); 
    }

    const { data } = await axiosInstance.put(`/experiencias/miembros/${memberId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    console.log('Respuesta del backend al actualizar:', data); // Debug log
    
    // Transformar la respuesta para que coincida con la estructura esperada
    if (data.member) {
        const transformedMember = {
            id: data.member.memberId,
            name: data.member.name,
            age: data.member.age,
            profession: data.member.profession,
            description: data.member.description,
            image: data.member.image
        };
        console.log('Miembro transformado después de actualizar:', transformedMember); // Debug log
        return transformedMember;
    }
    
    return data;
}; 