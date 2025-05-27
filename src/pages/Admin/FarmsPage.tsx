import React from 'react';
import { PageWrapper } from '@/components/admin/PageWrapper';
import FarmsManagement from '@/features/admin/farms/FarmSection';

const FarmsPage: React.FC = () => (
    <PageWrapper
        title="Fincas"
        description="Gestiona todas las fincas y propiedades rurales"
    >
        <FarmsManagement />
    </PageWrapper>
);

export default FarmsPage;