import { PageWrapper } from "@/components/admin/PageWrapper";
import CategoriesManagement from "@/features/admin/categories/CategoriesManagement";

const CategoriesPage: React.FC = () => (
    <PageWrapper
      title="Categorías"
      description="Organiza las categorías de productos y servicios"
    >
      <CategoriesManagement />
    </PageWrapper>
);

export default CategoriesPage;