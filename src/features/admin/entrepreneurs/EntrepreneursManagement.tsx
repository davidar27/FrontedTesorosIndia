import GenericManagement from '../../../components/admin/GenericManagent';
import { EntrepreneurCard } from './EntrepreneursCard';
import { createEntrepreneursConfig } from '@/features/admin/entrepreneurs/createEntrepreneursConfig';
import { Entrepreneur } from './EntrepreneursTypes';




const entrepreneurs: Entrepreneur[] = [
    {
        id: 1,
        name: "Arturo Ocampo",
        email: "arturo@example.com",
        phone: "+57 300 123 4567",
        farm: "Puerto Arturo",
        image: "",
        joinDate: "2023-01-15", 
        status: "active",
    },
    // ... más emprendedores
];

export default function EntrepreneursManagement() {
    const handleEdit = (entrepreneur: Entrepreneur) => {
        console.log('Editing entrepreneur:', entrepreneur);
    };

    const handleDelete = (entrepreneurId: number) => {
        console.log('Deleting entrepreneur:', entrepreneurId);
    };

    const handleCreate = () => {
       
    };

    const config = createEntrepreneursConfig(
        entrepreneurs,
        EntrepreneurCard,
        { onEdit: handleEdit, onDelete: handleDelete, onCreate: handleCreate }
    );


    

    return (
        <>
            <GenericManagement config={config} />
        </>
    );
}