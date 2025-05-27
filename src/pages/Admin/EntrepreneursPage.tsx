import { PageWrapper } from "@/components/admin/PageWrapper";
import EntrepreneursManagement from "@/features/admin/entrepreneurs/EntrepreneursManagement";

const EntrepreneursPage: React.FC = () => (
    <PageWrapper
        title="Emprendedores"
        description="Administra los emprendedores y sus proyectos"
    >
        <EntrepreneursManagement />
    </PageWrapper>
);

export default EntrepreneursPage;