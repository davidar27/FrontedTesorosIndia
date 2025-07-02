import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePageContext } from '@/context/PageContext';
import useAuth from '@/context/useAuth';
import useExperiencePermissions from '@/hooks/useExperiencePermissions';
import { useExperienceData } from '@/features/experience/hooks/useExperienceData';
import { useEditMode } from '@/features/experience/hooks/useEditMode';

// Componentes
import { ErrorState } from '@/features/experience/components/ErrorState';
import HeroSection from '@/features/experience/components/HeroSection';
import QuickStats from '@/features/experience/components/QuickStats';
import HistorySection from '@/features/experience/components/HistorySection';
import ActivitiesAndMap from '@/features/experience/components/ActivitiesAndMap';
import TeamSection from '@/features/experience/components/TeamSection';
import ProductsSection from '@/features/experience/components/ProductsSection';
import ReviewsSection from '@/features/experience/components/ReviewsSection';
import CTASection from '@/features/experience/components/CTASection';
import EditModeNotification from '@/features/experience/components/EditModeNotification';
import LoadingSpinner from '@/components/ui/display/LoadingSpinner';


const ExperiencePage: React.FC = () => {
    const { experience_id } = useParams();
    const { user } = useAuth();
    const { isEditMode } = usePageContext();
    const [showEditNotification, setShowEditNotification] = useState(false);

    const experienceId = Number(experience_id);
    const {
        experience,
        members,
        products,
        reviews,
        isLoading,
        error
    } = useExperienceData(experienceId);

    const editModeData = useEditMode(experience, products, members);
    const permissions = useExperiencePermissions();

    useEffect(() => {
        if (user && experience_id) {
            setShowEditNotification(true);
        }
    }, [user, experience_id]);

    if (isLoading) return <LoadingSpinner />;
    if (error || !experience) return <ErrorState />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
            <EditModeNotification
                isVisible={showEditNotification && isEditMode}
                onClose={() => setShowEditNotification(false)}
                experienceName={experience.name}
            />

            <HeroSection experience={experience} />

            <div className="container mx-auto py-8 responsive-padding-x">
                <QuickStats
                    membersCount={members.length}
                    productsCount={products.length}
                    averageRating={reviews.length}
                />

                <HistorySection
                    experience={experience}
                    isEditMode={isEditMode}
                    editData={editModeData.editData}
                    onEditDataChange={(data) => editModeData.setEditData(prev => ({ ...prev, ...data }))} />

                <ActivitiesAndMap
                    experience={experience}
                    isEditMode={isEditMode}
                    editData={editModeData.editData}
                    onEditDataChange={(data) => editModeData.setEditData(prev => ({ ...prev, ...data }))}
                />

                <TeamSection
                    members={isEditMode ? editModeData.editMembers : members}
                    isEditMode={isEditMode}
                    permissions={permissions}
                    onAddMember={editModeData.addMember}
                    onRemoveMember={editModeData.removeMember}
                    editMembers={editModeData.editMembers}
                />

                <ProductsSection
                    products={isEditMode ? editModeData.editProducts : products}
                    isEditMode={isEditMode}
                    permissions={permissions}
                    editProducts={editModeData.editProducts}
                    onAddProduct={editModeData.addProduct}
                    onRemoveProduct={editModeData.removeProduct}
                />

                {!isEditMode && (
                    <>
                        <ReviewsSection reviews={reviews} averageRating={reviews.length} />
                        <CTASection />
                    </>
                )}
            </div>
        </div>
    );
};
export default ExperiencePage;