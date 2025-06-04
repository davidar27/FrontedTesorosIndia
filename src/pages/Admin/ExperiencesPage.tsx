import React from 'react';
import { PageWrapper } from '@/components/admin/PageWrapper';
import ExperiencesManagement from '@/features/admin/experiences/ExperienceSection';

const ExperiencesPage: React.FC = () => (
    <PageWrapper
        title="Experiencias"
        description="Gestiona todas las experiencias y propiedades rurales"
    >
        <ExperiencesManagement />
    </PageWrapper>
);

export default ExperiencesPage;