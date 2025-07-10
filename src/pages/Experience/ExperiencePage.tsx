import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { usePageContext } from '@/context/PageContext';
import useAuth from '@/context/useAuth';
import useExperiencePermissions from '@/hooks/useExperiencePermissions';
import { useExperienceData } from '@/features/experience/hooks/useExperienceData';
import { useEditMode } from '@/features/experience/hooks/useEditMode';
import { CategoriesApi } from '@/services/home/categories';
import { Category } from '@/features/admin/categories/CategoriesTypes';
import ConfirmDialog from '@/components/ui/feedback/ConfirmDialog';

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

interface OutletContext {
    registerStatusChangeHandler: (handler: () => void) => void;
    registerSaveChangesHandler: (handler: () => Promise<boolean>) => void;
    updateCurrentStatus: (status: string) => void;
    updateSavingStatus: (saving: boolean) => void;
}

const ExperiencePage: React.FC = () => {
    const { experience_id } = useParams();
    const { user } = useAuth();
    const { isEditMode } = usePageContext();
    const { 
        registerStatusChangeHandler, 
        registerSaveChangesHandler,
        updateCurrentStatus,
        updateSavingStatus 
    } = useOutletContext<OutletContext>();
    const [showEditNotification, setShowEditNotification] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [isChangingStatus, setIsChangingStatus] = useState(false);

    const experienceId = Number(experience_id);
    const {
        experience,
        members,
        products,
        reviews,
        reviewStats,
        setReviews,
        isLoading,
        error
    } = useExperienceData(experienceId);

    // Cargar categorías
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await CategoriesApi.getCategories();
                setCategories(categoriesData || []);
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const editModeData = useEditMode(experience, products, members);
    const permissions = useExperiencePermissions();

    useEffect(() => {
        if (user && experience_id) {
            setShowEditNotification(true);
        }
    }, [user, experience_id]);

    // Actualizar el estado en el layout cuando cambie
    useEffect(() => {
        if (updateCurrentStatus && editModeData.editData?.status) {
            updateCurrentStatus(editModeData.editData.status);
        }
    }, [editModeData.editData?.status, updateCurrentStatus]);

    // Actualizar el estado de guardado en el layout
    useEffect(() => {
        if (updateSavingStatus) {
            updateSavingStatus(editModeData.isSaving);
        }
    }, [editModeData.isSaving, updateSavingStatus]);

    // Debug: Monitorear cambios en editMembers
    useEffect(() => {
        console.log('ExperiencePage: editMembers actualizado:', editModeData.editMembers);
    }, [editModeData.editMembers]);

    // Funciones para manejar el cambio de estado
    const handleStatusChangeRequest = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmStatusChange = async () => {
        setIsChangingStatus(true);
        try {
            await editModeData.handleChangeStatus();
        } finally {
            setIsChangingStatus(false);
            setShowConfirmDialog(false);
        }
    };

    const handleCancelStatusChange = () => {
        setShowConfirmDialog(false);
    };

    // Función para manejar el guardado de cambios
    const handleSaveChanges = useCallback(async (): Promise<boolean> => {
        console.log('ExperiencePage: handleSaveChanges called, editData:', editModeData.editData); // Debug log
        const result = await editModeData.handleSaveChanges();
        return result || false;
    }, [editModeData]);

    // Registrar la función de confirmación en el layout
    useEffect(() => {
        if (registerStatusChangeHandler) {
            registerStatusChangeHandler(handleStatusChangeRequest);
        }
    }, [registerStatusChangeHandler]);

    // Registrar la función de guardar cambios en el layout
    useEffect(() => {
        if (registerSaveChangesHandler) {
            registerSaveChangesHandler(handleSaveChanges);
        }
    }, [registerSaveChangesHandler, handleSaveChanges]);

    // Variables para el ConfirmDialog
    const isPublished = editModeData.editData?.status === 'publicada';
    const confirmTitle = isPublished ? 'Desactivar Experiencia' : 'Activar Experiencia';
    const confirmDescription = isPublished 
        ? '¿Estás seguro de que quieres desactivar esta experiencia? Los usuarios no podrán verla hasta que la actives nuevamente.'
        : '¿Estás seguro de que quieres activar esta experiencia? Será visible para todos los usuarios.';
    const confirmText = isPublished ? 'Desactivar' : 'Activar';

    if (isLoading) return <LoadingSpinner />;
    if (error || !experience) return <ErrorState />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
            <EditModeNotification
                isVisible={showEditNotification && isEditMode}
                onClose={() => setShowEditNotification(false)}
                experienceName={experience.name}
            />

            <HeroSection 
                experience={experience} 
                reviews={reviews} 
                isEditMode={isEditMode} 
                editData={editModeData.editData}
                onEditDataChange={(data) => editModeData.setEditData(prev => ({ ...prev, ...data }))}
            />

            <div className="container mx-auto py-8 responsive-padding-x">
                <QuickStats
                    membersCount={members.length}
                    productsCount={products.length}
                    averageRating={reviews}
                />

                <HistorySection
                    experience={experience}
                    isEditMode={isEditMode}
                    editData={editModeData.editData}
                    onEditDataChange={(data) => editModeData.setEditData(prev => ({ ...prev, ...data }))}
                    onImageChange={editModeData.handleImageChange}
                />

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
                    onAddMember={(member) => {
                        console.log('ExperiencePage: onAddMember llamado con:', member); // Debug log
                        editModeData.addMember(member);
                    }}
                    onRemoveMember={(memberId) => {
                        console.log('ExperiencePage: onRemoveMember llamado con ID:', memberId); // Debug log
                        editModeData.removeMember(memberId);
                    }}
                    onUpdateMember={(memberId, updatedMember) => {
                        console.log('ExperiencePage: onUpdateMember llamado con ID:', memberId, 'miembro:', updatedMember); // Debug log
                        editModeData.updateMember(memberId, updatedMember);
                    }}
                    editMembers={editModeData.editMembers}
                    onEditDataChange={(data) => editModeData.setEditData(prev => ({ ...prev, ...data }))}
                />


                <ProductsSection
                    products={isEditMode ? editModeData.editProducts : products}
                    isEditMode={isEditMode}
                    permissions={permissions}
                    editProducts={editModeData.editProducts}
                    onAddProduct={editModeData.addProduct}
                    onRemoveProduct={editModeData.removeProduct}
                    categories={categories}
                />

                {!isEditMode && (
                    <>
                        <ReviewsSection
                            reviews={reviews}
                            stats={reviewStats}
                            setReviews={setReviews}
                            experienceId={experienceId}
                            entity="experiencia"
                        />
                        <CTASection experience={experience} setReviews={setReviews} />
                    </>
                )}
            </div>

            {/* ConfirmDialog para cambio de estado */}
            <ConfirmDialog
                open={showConfirmDialog}
                title={confirmTitle}
                description={confirmDescription}
                confirmText={confirmText}
                onConfirm={handleConfirmStatusChange}
                onCancel={handleCancelStatusChange}
                loading={isChangingStatus}
                className="!backdrop-blur-none bg-black/60"
            />
        </div>
    );
};

export default ExperiencePage;