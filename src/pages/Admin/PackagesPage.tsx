import PackagesManagement from "@/features/admin/packages/PackagesManagement";
import { PageWrapper } from "@/components/admin/PageWrapper";

const PackagesPage: React.FC = () => (
  <PageWrapper
    title="Paquetes"
    description="Gestiona los paquetes turísticos disponibles"
  >
    <PackagesManagement />
  </PageWrapper>
);

export default PackagesPage;